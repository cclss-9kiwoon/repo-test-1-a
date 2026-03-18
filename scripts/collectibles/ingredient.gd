extends Area2D
## A collectible ingredient item for recipe completion.

@export var ingredient_name: String = ""
@export var display_name: String = ""

@onready var sprite: Sprite2D = $Sprite2D
@onready var label: Label = $Label


func _ready() -> void:
	body_entered.connect(_on_body_entered)
	if label and display_name:
		label.text = display_name


func _on_body_entered(body: Node2D) -> void:
	if body is PlayerController or body is CompanionController:
		GameManager.collect_ingredient(ingredient_name)
		# TODO: play sfx via AudioManager
		queue_free()
