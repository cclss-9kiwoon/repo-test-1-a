import pygame
from game.constants import GROUND_COLOR, GROUND_Y_FRACTION


class Renderer:
    def __init__(self, screen):
        self.screen = screen
        self.width = screen.get_width()
        self.height = screen.get_height()
        self.ground_y = int(self.height * GROUND_Y_FRACTION)

    def draw_ground(self):
        pygame.draw.rect(
            self.screen,
            GROUND_COLOR,
            (0, self.ground_y, self.width, self.height - self.ground_y),
        )
        pygame.draw.line(
            self.screen,
            (100, 180, 100),
            (0, self.ground_y),
            (self.width, self.ground_y),
            2,
        )
