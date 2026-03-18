extends Control
## Main menu screen.

@onready var play_button: Button = $VBoxContainer/PlayButton
@onready var title_label: Label = $TitleLabel


func _ready() -> void:
	if play_button:
		play_button.pressed.connect(_on_play_pressed)


func _on_play_pressed() -> void:
	SceneManager.go_to_stage(1)
