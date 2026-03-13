import os
import pygame
from game.constants import (
    WINDOW_FRACTION,
    FPS,
    BACKGROUND_COLOR,
    GROUND_Y_FRACTION,
    WINDOW_TITLE,
    KEY_LEFT,
    KEY_RIGHT,
    KEY_JUMP,
    KEY_SWING,
    KEY_CROUCH,
)
from game.renderer import Renderer
from game.character import Character


def run():
    os.environ["SDL_VIDEO_CENTERED"] = "1"

    pygame.init()

    desktop_sizes = pygame.display.get_desktop_sizes()
    desk_w, desk_h = desktop_sizes[0]
    win_w = int(desk_w * WINDOW_FRACTION)
    win_h = int(desk_h * WINDOW_FRACTION)

    screen = pygame.display.set_mode((win_w, win_h))
    pygame.display.set_caption(WINDOW_TITLE)

    clock = pygame.time.Clock()
    renderer = Renderer(screen)
    ground_y = int(win_h * GROUND_Y_FRACTION)
    character = Character(win_w // 2, ground_y, win_w)

    input_state = {
        "left": False,
        "right": False,
        "jump": False,
        "swing": False,
        "crouch": False,
    }

    running = True
    while running:
        dt = clock.tick(FPS) / 1000.0
        if dt > 0.05:
            dt = 0.05

        # Events
        input_state["jump"] = False
        input_state["swing"] = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == KEY_LEFT:
                    input_state["left"] = True
                elif event.key == KEY_RIGHT:
                    input_state["right"] = True
                elif event.key == KEY_JUMP:
                    input_state["jump"] = True
                elif event.key == KEY_SWING:
                    input_state["swing"] = True
                elif event.key == KEY_CROUCH:
                    input_state["crouch"] = True
                elif event.key == pygame.K_ESCAPE:
                    running = False
            elif event.type == pygame.KEYUP:
                if event.key == KEY_LEFT:
                    input_state["left"] = False
                elif event.key == KEY_RIGHT:
                    input_state["right"] = False
                elif event.key == KEY_CROUCH:
                    input_state["crouch"] = False

        # Update
        character.update(dt, input_state)

        # Render
        screen.fill(BACKGROUND_COLOR)
        renderer.draw_ground()
        character.draw(screen)
        pygame.display.flip()

    pygame.quit()
