import math
import pygame
from game.constants import (
    CHAR_COLOR,
    CHAR_LINE_WIDTH,
    HEAD_RADIUS,
    TORSO_LENGTH,
    ARM_LENGTH,
    LEG_LENGTH,
    GRAVITY,
    JUMP_VELOCITY,
    MOVE_SPEED,
    WALK_CYCLE_PERIOD,
    SWING_DURATION,
    SWING_ARC_START,
    SWING_ARC_END,
)


class Character:
    def __init__(self, x, ground_y, screen_width):
        self.x = float(x)
        self.y = float(ground_y)
        self.ground_y = float(ground_y)
        self.screen_width = screen_width
        self.vel_x = 0.0
        self.vel_y = 0.0
        self.on_ground = True
        self.facing = 1  # 1=right, -1=left

        self.is_crouching = False
        self.is_swinging = False
        self.swing_timer = 0.0
        self.walk_timer = 0.0
        self.is_moving = False

    def update(self, dt, input_state):
        # Swing timer
        if self.is_swinging:
            self.swing_timer += dt
            if self.swing_timer >= SWING_DURATION:
                self.is_swinging = False
                self.swing_timer = 0.0

        # Crouch
        if self.on_ground:
            self.is_crouching = input_state["crouch"]
        else:
            self.is_crouching = False

        # Horizontal movement
        if self.on_ground and not self.is_crouching:
            if input_state["left"]:
                self.vel_x = -MOVE_SPEED
                self.facing = -1
                self.is_moving = True
            elif input_state["right"]:
                self.vel_x = MOVE_SPEED
                self.facing = 1
                self.is_moving = True
            else:
                self.vel_x = 0
                self.is_moving = False
        elif self.is_crouching:
            self.vel_x = 0
            self.is_moving = False

        # Walk animation timer
        if self.is_moving and self.on_ground:
            self.walk_timer += dt
        else:
            self.walk_timer = 0.0

        # Jump
        if input_state["jump"] and self.on_ground:
            self.vel_y = JUMP_VELOCITY
            self.on_ground = False

        # Swing initiation
        if input_state["swing"] and self.on_ground and not self.is_swinging:
            self.is_swinging = True
            self.swing_timer = 0.0

        # Gravity
        self.vel_y += GRAVITY * dt

        # Position
        self.x += self.vel_x * dt
        self.y += self.vel_y * dt

        # Ground collision
        if self.y >= self.ground_y:
            self.y = self.ground_y
            self.vel_y = 0
            self.on_ground = True

        # Screen bounds
        margin = 20
        self.x = max(margin, min(self.x, self.screen_width - margin))

    def draw(self, surface):
        f = self.facing
        ox = int(self.x)
        oy = int(self.y)

        if self.is_crouching:
            self._draw_crouching(surface, ox, oy, f)
        elif not self.on_ground:
            self._draw_jumping(surface, ox, oy, f)
        elif self.is_moving:
            self._draw_walking(surface, ox, oy, f)
        else:
            self._draw_idle(surface, ox, oy, f)

        # Swing overlay
        if self.is_swinging:
            self._draw_swing_overlay(surface, ox, oy, f)

        # Shadow
        if not self.on_ground:
            shadow_alpha = max(0, 1.0 - (self.ground_y - self.y) / 200.0)
            shadow_w = int(20 * shadow_alpha)
            if shadow_w > 2:
                shadow_surf = pygame.Surface((shadow_w * 2, 6), pygame.SRCALPHA)
                pygame.draw.ellipse(
                    shadow_surf, (0, 0, 0, int(80 * shadow_alpha)), (0, 0, shadow_w * 2, 6)
                )
                surface.blit(shadow_surf, (ox - shadow_w, int(self.ground_y) - 3))

    def _draw_idle(self, surface, ox, oy, f):
        head_y = oy - 80
        torso_top = head_y + HEAD_RADIUS
        torso_bottom = oy - 30

        # Head
        pygame.draw.circle(surface, CHAR_COLOR, (ox, head_y), HEAD_RADIUS, CHAR_LINE_WIDTH)
        # Torso
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_top), (ox, torso_bottom), CHAR_LINE_WIDTH)
        # Arms
        arm_y = torso_top + 10
        lax = ox + int(-15 * f)
        lay = arm_y + 15
        rax = ox + int(15 * f)
        ray = arm_y + 15
        pygame.draw.line(surface, CHAR_COLOR, (ox, arm_y), (lax, lay), CHAR_LINE_WIDTH)
        pygame.draw.line(surface, CHAR_COLOR, (ox, arm_y), (rax, ray), CHAR_LINE_WIDTH)
        # Legs
        llx = ox - 12
        lly = oy
        rlx = ox + 12
        rly = oy
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_bottom), (llx, lly), CHAR_LINE_WIDTH)
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_bottom), (rlx, rly), CHAR_LINE_WIDTH)

    def _draw_walking(self, surface, ox, oy, f):
        head_y = oy - 80
        torso_top = head_y + HEAD_RADIUS
        torso_bottom = oy - 30

        # Head
        pygame.draw.circle(surface, CHAR_COLOR, (ox, head_y), HEAD_RADIUS, CHAR_LINE_WIDTH)
        # Torso
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_top), (ox, torso_bottom), CHAR_LINE_WIDTH)

        # Walk cycle oscillation
        cycle = math.sin(self.walk_timer * 2 * math.pi / WALK_CYCLE_PERIOD)

        # Legs
        leg_spread = int(16 * cycle)
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox + leg_spread, oy), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox - leg_spread, oy), CHAR_LINE_WIDTH
        )

        # Arms swing opposite to legs
        arm_y = torso_top + 10
        arm_spread = int(12 * cycle)
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox - arm_spread, arm_y + 18), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox + arm_spread, arm_y + 18), CHAR_LINE_WIDTH
        )

    def _draw_jumping(self, surface, ox, oy, f):
        head_y = oy - 80
        torso_top = head_y + HEAD_RADIUS
        torso_bottom = oy - 30

        # Head
        pygame.draw.circle(surface, CHAR_COLOR, (ox, head_y), HEAD_RADIUS, CHAR_LINE_WIDTH)
        # Torso
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_top), (ox, torso_bottom), CHAR_LINE_WIDTH)

        # Arms raised
        arm_y = torso_top + 10
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox - 18, arm_y - 10), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox + 18, arm_y - 10), CHAR_LINE_WIDTH
        )

        # Legs pulled up
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox - 10, torso_bottom + 16), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox + 10, torso_bottom + 16), CHAR_LINE_WIDTH
        )

    def _draw_crouching(self, surface, ox, oy, f):
        head_y = oy - 50
        torso_top = head_y + HEAD_RADIUS
        torso_bottom = oy - 18

        # Head
        pygame.draw.circle(surface, CHAR_COLOR, (ox, head_y), HEAD_RADIUS, CHAR_LINE_WIDTH)
        # Torso (shorter)
        pygame.draw.line(surface, CHAR_COLOR, (ox, torso_top), (ox, torso_bottom), CHAR_LINE_WIDTH)
        # Arms tucked
        arm_y = torso_top + 6
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox - 10 * f, arm_y + 8), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, arm_y), (ox + 10 * f, arm_y + 8), CHAR_LINE_WIDTH
        )
        # Legs wide and bent
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox - 18, oy), CHAR_LINE_WIDTH
        )
        pygame.draw.line(
            surface, CHAR_COLOR, (ox, torso_bottom), (ox + 18, oy), CHAR_LINE_WIDTH
        )

    def _draw_swing_overlay(self, surface, ox, oy, f):
        if self.is_crouching:
            arm_origin_y = oy - 50 + HEAD_RADIUS + 6
        else:
            arm_origin_y = oy - 80 + HEAD_RADIUS + 10

        t = self.swing_timer / SWING_DURATION
        angle_deg = SWING_ARC_START + (SWING_ARC_END - SWING_ARC_START) * t
        angle_rad = math.radians(angle_deg)

        # The swinging arm (front arm based on facing)
        end_x = ox + int(ARM_LENGTH * math.cos(angle_rad) * f)
        end_y = int(arm_origin_y - ARM_LENGTH * math.sin(angle_rad))

        # Draw swinging arm in a brighter color
        swing_color = (255, 200, 100)
        pygame.draw.line(surface, swing_color, (ox, int(arm_origin_y)), (end_x, end_y), CHAR_LINE_WIDTH + 1)

        # Draw small arc trail
        if t > 0.1:
            prev_t = max(0, t - 0.15)
            prev_angle = math.radians(SWING_ARC_START + (SWING_ARC_END - SWING_ARC_START) * prev_t)
            prev_x = ox + int(ARM_LENGTH * math.cos(prev_angle) * f)
            prev_y = int(arm_origin_y - ARM_LENGTH * math.sin(prev_angle))
            trail_color = (255, 200, 100, 128)
            pygame.draw.line(surface, (255, 180, 60), (prev_x, prev_y), (end_x, end_y), 2)
