package hare.displayer.dto;

import java.awt.Color;

public enum Colors {
    COLOR_PACKAGE(Color.YELLOW),
    COLOR_CLASS(Color.ORANGE),
    COLOR_METHOD(Color.BLUE);

    private Color color;

    Colors(Color color) {
        this.color = color;
    }

    public Color getColor() {
        return color;
    }
}
