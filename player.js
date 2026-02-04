// player.js

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.onPassableSurface = false;
        this.jumpsLeft = PLAYER_MAX_JUMPS;
        this.lastX = x;
        this.lastY = y;
        this.direction = 1;

        this.health = PLAYER_INITIAL_HEALTH;
        this.maxHealth = PLAYER_INITIAL_HEALTH;
        this.isInvincible = false;
        this.invincibilityTimer = 0;

        this.captureState = 'none'; 
        this.captureAnimProgress = 0;
        this.captureStartPos = null;
        this.captureEndPos = null;
        this.capturedByPlatform = null; 

        this.rewardCooldown = 0;
        this.rewardPlatform = null;
        this.rewardSource = null; 
        this.canInteractWithChest = null;
        
        this.heldDebris = null;
        this.canPickUpDebris = null;

        this.lastCenterX = this.x + this.width / 2;
        this.lastCenterY = this.y + this.height / 2;
        
        // Timer para o modo de partículas reduzidas
        this.trailTimer = 0;
        this.TRAIL_INTERVAL = 0.03; 
        
        this.cloudStandTimer = 0;

        this.isSomersaulting = false;
        this.rotation = 0;
        this.coyoteTimeCounter = 0;
    }

    canJump() {
        return this.jumpsLeft > 0 || this.coyoteTimeCounter > 0;
    }

    jump() {
        if (!this.canJump()) return;

        if (this.coyoteTimeCounter > 0) {
            this.isJumping = false;
            this.jumpsLeft = PLAYER_MAX_JUMPS;
        }
        
        if (this.jumpsLeft === PLAYER_MAX_JUMPS) {
            this.isSomersaulting = false;
            this.rotation = 0;
        } else {
            this.isSomersaulting = true;
            this.rotation = 0; 
        }
        
        this.velocityY = -JUMP_FORCE;
        this.isJumping = true;
        this.jumpsLeft--;
        this.coyoteTimeCounter = 0;
        
        this.cloudStandTimer = 0;
        
        playSound(sounds.jump);
    }

    draw(ctx, scrollOffset, verticalScrollOffset = 0, isVertical = false) {
        if (this.isInvincible && Math.floor(this.invincibilityTimer * 10) % 2 === 0) return;
        
        if (this.captureState === 'pulling' && this.captureAnimProgress >= 1) return;

        const playerX = this.x - (isVertical ? 0 : scrollOffset);
        const playerY = this.y - (isVertical ? verticalScrollOffset : 0);

        let drawWidth = this.width;
        let drawHeight = this.height;

        if (this.captureState === 'pulling') {
            drawWidth = this.width * (1 - this.captureAnimProgress * 0.9);
            drawHeight = this.height * (1 - this.captureAnimProgress * 0.9);
        }

        const scaleFactorX = drawWidth / this.width;
        const scaleFactorY = drawHeight / this.height;

        ctx.save();
        
        const centerX = playerX + drawWidth / 2;
        const centerY = playerY + drawHeight / 2;

        if (this.isSomersaulting) {
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation * this.direction); 
            ctx.translate(-centerX, -centerY);
        }

        // --- CORPO DO JOGADOR ---
        const bodyGrad = ctx.createLinearGradient(playerX, playerY, playerX, playerY + drawHeight);
        bodyGrad.addColorStop(0, '#ff8b8b');
        bodyGrad.addColorStop(1, '#d13423');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(playerX, playerY, drawWidth, drawHeight);

        // --- CHAPÉU PADRÃO (Vermelho) ---
        const hatX = playerX - (5 * scaleFactorX);
        const hatY = playerY - (10 * scaleFactorY);
        const hatWidth = drawWidth + (10 * scaleFactorX);
        const hatHeight = 15 * scaleFactorY;
        
        const hatGrad = ctx.createLinearGradient(hatX, hatY, hatX, hatY + hatHeight);
        hatGrad.addColorStop(0, '#ff4757');
        hatGrad.addColorStop(1, '#a4281b');
        
        ctx.fillStyle = hatGrad;
        ctx.fillRect(hatX, hatY, hatWidth, hatHeight);
        
        ctx.strokeStyle = '#a4281b';
        ctx.lineWidth = 2;
        ctx.strokeRect(hatX, hatY, hatWidth, hatHeight);

        ctx.restore();
        
        if (this.heldDebris) {
            this.heldDebris.draw(ctx, verticalScrollOffset);
        }
        
        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.strokeRect(playerX, playerY, this.width, this.height);
        }
    }
    
    getCaptured(platform, windowPos) {
        if (platform.windowState !== 'active' || this.captureState !== 'none' || this.isInvincible) {
            return;
        }

        platform.windowState = 'in_progress';

        if (platform.windowType === 'reward') {
            this.rewardPlatform = platform;
            this.rewardSource = 'window';
            const spawnPos = { x: this.x + this.width / 2, y: this.y };
            triggerCoinReward(this, spawnPos, WINDOW_REWARD_COIN_COUNT);
        } else { 
            this.captureState = 'reaching';
            this.capturedByPlatform = platform; 
            this.captureAnimProgress = 0;
            this.captureStartPos = { x: this.x, y: this.y };
            this.captureEndPos = windowPos;
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
    
    getCapturedByChest(chestPlatform) {
        this.takeDamage(true);
        chestPlatform.chestState = 'open';
    }

    update(deltaTime, keys, platforms, scrollOffset, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris, reduceParticles) {
        const particlesToCreate = [];
        const isVertical = isVerticalPhase();
        const JUMP_RELEASE_DAMPING = 0.5;

        const wasJumping = this.isJumping;
        let landedOnPlatformSurface = false;
        let landedOnWallSurface = false;
        let suppressLandingParticles = false;
        let isOnCloud = false;
        let onSolidPlatformThisFrame = false;
        let landedPlatformType = null;

        if (this.rewardPlatform && !coinRewardState.active && coinAnimations.length === 0) {
            this.rewardPlatform.windowState = 'closed';
            this.rewardPlatform = null;
        }
        
        if (this.rewardCooldown > 0) {
            this.rewardCooldown -= deltaTime;
            return { particles: particlesToCreate, closestDebris: null };
        }

        if (this.captureState !== 'none') {
            if(this.captureState === 'reaching') {
                this.captureAnimProgress += deltaTime / CAPTURE_REACH_DURATION;
                if(this.captureAnimProgress >= 1) {
                    this.captureAnimProgress = 0;
                    this.captureState = 'pulling';
                }
            } 
            else if (this.captureState === 'pulling') {
                this.captureAnimProgress += deltaTime / CAPTURE_PULL_DURATION;
                this.x = this.captureStartPos.x + (this.captureEndPos.x - this.captureStartPos.x) * this.captureAnimProgress;
                this.y = this.captureStartPos.y + (this.captureEndPos.y - this.captureStartPos.y) * this.captureAnimProgress;
                if(this.captureAnimProgress >= 1) this.captureAnimProgress = 1; 
            }
            return { particles: particlesToCreate, closestDebris: null };
        }

        if (infiniteInvincibilityCheat) {
            this.isInvincible = true;
        }

        if (this.isInvincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0 && !infiniteInvincibilityCheat) {
                this.isInvincible = false;
            }
        }

        this.lastX = this.x;
        this.lastY = this.y;
        
        this.velocityX = 0; 
        if (keys.right) this.velocityX += PLAYER_SPEED;
        if (keys.left) this.velocityX -= PLAYER_SPEED;
        
        if (keys.right) this.direction = 1;
        if (keys.left) this.direction = -1;

        this.x += this.velocityX * deltaTime;
        
        let proposedVelocityY = this.velocityY;
        
        if (keys.down && this.onPassableSurface) {
            this.y += 5;
            proposedVelocityY = 180;
        } else {
            proposedVelocityY += GRAVITY * deltaTime;
        }
        
        if (proposedVelocityY < 0 && this.isJumping && !keys.space) {
            proposedVelocityY *= JUMP_RELEASE_DAMPING;
        }

        const proposedY = this.y + proposedVelocityY * deltaTime;
        const falling = proposedVelocityY > 0;

        const sweptY = Math.min(this.y, proposedY);
        const sweptH = Math.max(this.y + this.height, proposedY + this.height) - sweptY;
        const margin = 5;
        const sweptPlayerRect = { x: this.x + margin, y: sweptY, width: this.width - margin*2, height: sweptH };

        this.onPassableSurface = false; 

        platforms.forEach(platform => {
            if (sweptPlayerRect.x < platform.x + platform.width && sweptPlayerRect.x + sweptPlayerRect.width > platform.x) {
                const platformTop = platform.y;
                const wasAbove = this.y + this.height <= platformTop + 5; 
                const isBelowNow = proposedY + this.height >= platformTop;

                if (falling && wasAbove && isBelowNow) {
                    if (platform.type === 'stable' && keys.down) return; 

                    if (platform.type === 'pass-through-slow') {
                        isOnCloud = true;
                        if (!onSolidPlatformThisFrame) landedPlatformType = 'cloud';
                    } else {
                        this.y = platformTop - this.height;
                        proposedVelocityY = 0;
                        onSolidPlatformThisFrame = true;
                        landedPlatformType = platform.visualType;
                        landedOnPlatformSurface = true;
                        if (platform.type === 'stable') this.onPassableSurface = true;
                        if (platform.type === 'falling') {
                            if (platform.fallSpeed > 0) suppressLandingParticles = true;
                            platform.isFalling = true;
                            this.onPassableSurface = false;
                        }
                    }
                }
            }
        });

        if (onSolidPlatformThisFrame) {
            this.velocityY = 0;
            this.isJumping = false;
            this.cloudStandTimer = 0; 
        } else if (isOnCloud) {
            this.isJumping = false;
            
            if (wasJumping) {
                this.jumpsLeft = PLAYER_MAX_JUMPS;
                this.cloudStandTimer = 0.5; 
            }
            
            if (this.cloudStandTimer > 0) {
                this.cloudStandTimer -= deltaTime;
                this.velocityY = 0; 
            } else {
                this.velocityY = 20; 
                this.y += this.velocityY * deltaTime;
            }
            
            // --- EFEITO NUVEM AJUSTADO (Maior, mais disperso e visível) ---
            const spawnChance = reduceParticles ? 0.3 : 1.0;
            
            if (Math.random() < spawnChance) {
                particlesToCreate.push({ 
                    // Espalha mais horizontalmente (50px)
                    x: this.x + this.width / 2 + (Math.random() - 0.5) * 50, 
                    y: this.y + this.height,
                    // Tamanho maior (4 a 8px)
                    size: Math.random() * 4 + 4, 
                    // Mais opaco (0.65)
                    color: 'rgba(255, 255, 255, 0.65)', 
                    lifespan: 0.6, initialLifespan: 0.6, 
                    // Movimento horizontal mais caótico
                    vx: (Math.random() - 0.5) * 60, 
                    vy: -(Math.random() * 20 + 10), 
                    isScreenSpace: false,
                    priority: 'low',
                    layer: 'front'
                });
            }

        } else {
            this.velocityY = proposedVelocityY;
            this.y = proposedY;
            this.isJumping = true;
            this.cloudStandTimer = 0;
        }
        
        if (this.isSomersaulting) {
            const baseSpeed = 12;
            const dynamicSpeed = Math.abs(this.velocityY) / 60; 
            this.rotation += (baseSpeed + dynamicSpeed) * deltaTime;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
                this.isSomersaulting = false;
            }
        }

        if (isVertical) {
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        } else {
            if (this.x < scrollOffset + 10) this.x = scrollOffset + 10;
        }
        
        if (this.heldDebris) {
            this.heldDebris.x = this.x + (this.width / 2) - (this.heldDebris.width / 2);
            this.heldDebris.y = this.y - this.heldDebris.height - 10;
        }
        
        const playerRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        const playerScreenRect = { x: this.x - (isVertical ? 0 : scrollOffset), y: this.y - (isVertical ? verticalScrollOffset : 0), width: this.width, height: this.height };
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            let hasCollided = false;

            if (enemy.type === 'falling_rock') {
                const rockRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
                if(isColliding(playerRect, rockRect)) hasCollided = true;
            } else {
                let effectivePlayerRect, enemyRect;
                if (enemy.isScreenSpaceEntity) { effectivePlayerRect = playerScreenRect; enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }; } 
                else { effectivePlayerRect = playerRect; enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }; }
                
                if (enemy.type === 'patrol') { if (isColliding(effectivePlayerRect, enemyRect)) hasCollided = true; } 
                else { const enemyCircle = { x: enemyRect.x + enemyRect.width / 2, y: enemyRect.y + enemyRect.height / 2, radius: enemyRect.width / 2 }; if (isCollidingCircleRect(enemyCircle, effectivePlayerRect)) hasCollided = true; }
            }

            if (hasCollided) {
                if (enemy.type === 'rebound') { enemy.rebound(scrollOffset); } 
                else { if (!this.isInvincible) { this.takeDamage(true); enemies.splice(i, 1); } }
            }
        }
        
        this.canInteractWithChest = null;
        platforms.forEach((platform) => {
            if (platform.hasChest && platform.chestState === 'closed') {
                const chestWidth = 50; const chestHeight = 40;
                const chestX = platform.x + (platform.width / 2) - (chestWidth / 2); const chestY = platform.y - chestHeight;
                const dx = (this.x + this.width / 2) - (chestX + chestWidth / 2); const dy = (this.y + this.height / 2) - (chestY + chestHeight / 2);
                if (Math.sqrt(dx * dx + dy * dy) < CHEST_PROMPT_DISTANCE) this.canInteractWithChest = platform;
            }

            if (platform.hasWindowTrap) {
                const windowWidth = 60; const windowHeight = 90;
                const windowX = platform.x + (platform.width / 2) - (windowWidth / 2); const windowY = platform.y - windowHeight;
                const windowHitbox = { x: windowX, y: windowY, width: windowWidth, height: windowHeight };
                if (isColliding(playerRect, windowHitbox) && keys.up) { this.getCaptured(platform, { x: windowX + windowWidth / 2, y: windowY + windowHeight / 2 }); }
            }

            let onObstacleSurface = false;
            platform.obstacles.forEach(obs => {
                if (obs.type === 'bush') return;

                let obsMainRect, obsSpikePartRect, lateralSpikeHitbox;
                let tookDamageFromSpike = false;

                if (obs.type === 'wall') {
                    obsMainRect = { x: platform.x + obs.x, y: platform.y - obs.height, width: obs.width, height: obs.height };
                    if (obs.lateralSpikes) lateralSpikeHitbox = { x: platform.x + obs.x - obs.lateralSpikes.protrusion, y: platform.y - obs.height + obs.lateralSpikes.yOffset, width: obs.lateralSpikes.protrusion, height: obs.lateralSpikes.height };
                } else if (obs.type === 'spike') {
                    obsMainRect = { x: platform.x + obs.x, y: platform.y - obs.height, width: obs.width, height: obs.height };
                } else if (obs.type === 'wallWithTopSpikes') {
                    obsMainRect = { x: platform.x + obs.x, y: platform.y - obs.wallHeight, width: obs.width, height: obs.wallHeight };
                    obsSpikePartRect = { x: platform.x + obs.x, y: platform.y - obs.wallHeight - obs.spikeHeight, width: obs.width, height: obs.spikeHeight };
                } else if (obs.type === 'spike-down') {
                    if (!this.isInvincible && isColliding(playerRect, { x: platform.x + obs.x, y: platform.y + platform.height, width: obs.width, height: obs.height })) {
                        this.takeDamage(true); if (this.velocityY < 0) this.velocityY = JUMP_FORCE * 0.3;
                    }
                    return;
                }

                const playerBottom = this.y + this.height; const lastPlayerBottom = this.lastY + this.height;
                const primarySurface = obsSpikePartRect || obsMainRect;
                if (primarySurface) {
                    const surfaceY = primarySurface.y;
                    const isHorizontallyAligned = this.x + this.width > primarySurface.x && this.x < primarySurface.x + primarySurface.width;
                    if (this.velocityY >= 0 && lastPlayerBottom <= surfaceY && playerBottom >= surfaceY && isHorizontallyAligned) {
                        onObstacleSurface = true;
                        if (obs.type === 'spike' || obs.type === 'wallWithTopSpikes') {
                            if (!this.isInvincible) { this.takeDamage(true); tookDamageFromSpike = true; }
                            landedOnWallSurface = true;
                        } else { landedOnWallSurface = true; }
                        if (!tookDamageFromSpike) { this.y = surfaceY - this.height; this.velocityY = 0; }
                        this.isJumping = false;
                    }
                }
                
                if (isColliding(playerRect, obsMainRect)) {
                    if (!this.isInvincible) {
                        if (lateralSpikeHitbox && isColliding(playerRect, lateralSpikeHitbox)) this.takeDamage(true);
                        else if (obs.type === 'spike') this.takeDamage(true);
                    }
                    if (obs.type === 'wall' || obs.type === 'wallWithTopSpikes') {
                        if (this.velocityY < 0 && this.lastY >= obsMainRect.y + obsMainRect.height) { this.y = obsMainRect.y + obsMainRect.height; this.velocityY = 0; } 
                        else if (this.velocityX !== 0) {
                            if (this.lastX + this.width <= obsMainRect.x) this.x = obsMainRect.x - this.width;
                            else if (this.lastX >= obsMainRect.x + obsMainRect.width) this.x = obsMainRect.x + obsMainRect.width;
                            this.velocityX = 0;
                        }
                    }
                }
                if (obsSpikePartRect && isColliding(playerRect, obsSpikePartRect)) { if (!this.isInvincible) this.takeDamage(true); }
            });

            if ((this.velocityY >= 0 && (this.x + this.width) > platform.x && this.x < (platform.x + platform.width) && (this.y + this.height) >= platform.y && this.lastY + this.height <= platform.y) && !onObstacleSurface) {
                if (platform.type === 'pass-through-slow') {
                    this.isJumping = false; this.onPassableSurface = true;
                } else {
                    this.velocityY = 0; this.y = platform.y - this.height; this.isJumping = false; 
                    this.onPassableSurface = (platform.type !== 'falling'); 
                    landedOnPlatformSurface = true; landedOnWallSurface = false;
                    landedPlatformType = platform.visualType;
                    if (platform.type === 'falling') { if (platform.fallSpeed > 0) suppressLandingParticles = true; platform.isFalling = true; }
                }
            }
        });
        
        if (wasJumping && !this.isJumping) {
            this.jumpsLeft = PLAYER_MAX_JUMPS; 
            
            if (!suppressLandingParticles && !isOnCloud) {
                playSound(sounds.land);
                this.isSomersaulting = false; this.rotation = 0;
                let landingParticleColor = '#4CAF50'; 
                if (landedOnWallSurface) landingParticleColor = '#A9A9A9'; 
                else if (landedPlatformType === 'stone') landingParticleColor = '#7f8c8d'; 
                else if (landedPlatformType === 'cloud') landingParticleColor = 'rgba(255, 255, 255, 0.8)'; 

                if (landedOnPlatformSurface || landedOnWallSurface) { 
                    const numLanding = reduceParticles ? 8 : 20;
                    for (let i = 0; i < numLanding; i++) { 
                        particlesToCreate.push({ x: this.x + this.width / 2, y: this.y + this.height, size: Math.random() * 4 + 3, color: landingParticleColor, lifespan: 0.6 + Math.random() * 0.4, initialLifespan: 1.0, vx: (Math.random() - 0.5) * 350, vy: (Math.random() * -200) - 80, isScreenSpace: false }); 
                    }
                }
            }
        }
        
        if (!this.isJumping) {
            this.coyoteTimeCounter = COYOTE_TIME_DURATION;
        } else {
            this.coyoteTimeCounter -= deltaTime;
        }

        if (reduceParticles) {
            this.trailTimer -= deltaTime;
            if (this.trailTimer <= 0) {
                if (Math.abs(this.velocityX) > 10 || (Math.abs(this.velocityY) > 10 && this.isJumping)) {
                    this.trailTimer = this.TRAIL_INTERVAL; 
                    const life = Math.random() * 0.4 + 0.2; 
                    particlesToCreate.push({
                        x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
                        y: this.y + this.height / 2 + (Math.random() - 0.5) * 20,
                        size: Math.random() * 3 + 2, 
                        color: Math.random() < 0.5 ? '#e67e22' : '#c0392b',
                        lifespan: life, initialLifespan: life,
                        vx: -(this.velocityX * 0.2), vy: -(this.velocityY * 0.2),
                        isScreenSpace: false, priority: 'high', layer: 'front', ignoreFreeze: false 
                    });
                }
            }
        } else {
            if ((Math.abs(this.velocityX) > 10) || (Math.abs(this.velocityY) > 10 && this.isJumping)) {
                for (let i = 0; i < 2; i++) {
                    const life = Math.random() * 0.4 + 0.2; 
                    particlesToCreate.push({
                        x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
                        y: this.y + this.height / 2 + (Math.random() - 0.5) * 20,
                        size: Math.random() * 3 + 2, 
                        color: Math.random() < 0.5 ? '#e67e22' : '#c0392b',
                        lifespan: life, initialLifespan: life,
                        vx: -(this.velocityX * 0.2), vy: -(this.velocityY * 0.2),
                        isScreenSpace: false
                    });
                }
            }
        }

        let closestDebris = null;
        if (bossDebris && !this.heldDebris) { 
            let minDistance = DEBRIS_PICKUP_DISTANCE;
            bossDebris.forEach(debris => {
                if (debris.state === 'landed') {
                    const dx = (this.x + this.width / 2) - (debris.x + debris.width / 2);
                    const dy = (this.y + this.height / 2) - (debris.y + debris.height / 2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < minDistance) { minDistance = distance; closestDebris = debris; }
                }
            });
        }
        this.canPickUpDebris = closestDebris;

        return { particles: particlesToCreate, closestDebris: this.canPickUpDebris };
    }

    triggerFallRespawn(platforms, verticalScrollOffset) {
        this.takeDamage(false);
        if (this.health > 0) {
            const visiblePlatforms = platforms.filter(p => p.y > verticalScrollOffset && p.y < verticalScrollOffset + canvas.height);
            const safePlatforms = visiblePlatforms.filter(p => p.visualType !== 'cloud' && !p.obstacles.some(obs => obs.type === 'spike-down'));

            let respawnPlatform = null;
            if (safePlatforms.length > 0) {
                respawnPlatform = safePlatforms.reduce((lowest, current) => (current.y > lowest.y) ? lowest : current);
            }

            if (respawnPlatform) {
                this.x = respawnPlatform.x + (respawnPlatform.width / 2) - (this.width / 2);
                this.y = respawnPlatform.y - this.height - 50;
            } else {
                this.x = canvas.width / 2 - this.width / 2;
                this.y = verticalScrollOffset + canvas.height / 2;
            }

            this.velocityY = 0;
            this.jumpsLeft = PLAYER_MAX_JUMPS;
        }
    }

    takeDamage(applyKnockback = false) {
        if (!this.isInvincible && this.captureState === 'none') {
            this.health--;
            this.jumpComboCount = 0; 
            this.isSomersaulting = false;
            playSound(sounds.damage);
            this.isInvincible = true;
            this.invincibilityTimer = INVINCIBILITY_DURATION;
            
            if(applyKnockback) {
                this.velocityY = -JUMP_FORCE / 2;
            }
        }
    }

    respawnInTower(platforms) {
        const platformCapturedOn = this.capturedByPlatform;
        if(!platformCapturedOn) return;
        
        if (platformCapturedOn.hasWindowTrap) {
            platformCapturedOn.windowState = 'closed';
        } else if (platformCapturedOn.hasChest) {
            // No futuro, podemos adicionar um estado de 'fechado e usado' se necessário
        }

        this.x = platformCapturedOn.x + (platformCapturedOn.width / 2) - (this.width / 2);
        this.y = platformCapturedOn.y - this.height - 5;
        
        this.velocityY = 0;
        this.jumpsLeft = PLAYER_MAX_JUMPS;
        this.captureState = 'none';
        this.capturedByPlatform = null;
        this.captureAnimProgress = 0;
    }

    respawn(platforms, scrollOffset) {
        this.health--;
        if (this.health > 0) {
            playSound(sounds.damage);
            this.isInvincible = true;
            this.invincibilityTimer = INVINCIBILITY_DURATION;

            const visiblePlatforms = platforms.filter(p => p.x + p.width > scrollOffset && p.x < scrollOffset + canvas.width);
            const safePlatforms = visiblePlatforms.filter(p => !p.obstacles.some(obs => obs.type === 'wall' || obs.type === 'spike' || obs.lateralSpikes || obs.type === 'wallWithTopSpikes'));
            let closestPlatform = null;
            let minDistance = Infinity;
            if (safePlatforms.length > 0) {
                safePlatforms.forEach(p => { const distance = Math.abs((p.x + p.width / 2) - (this.x)); if (distance < minDistance) { minDistance = distance; closestPlatform = p; } });
            }
            if (closestPlatform) { this.x = closestPlatform.x + (closestPlatform.width / 2) - (this.width / 2); this.y = closestPlatform.y - this.height - 150; } else { this.x = scrollOffset + 100; this.y = 100; }
            this.velocityY = 0;
            this.jumpsLeft = PLAYER_MAX_JUMPS;
        }
    }
}