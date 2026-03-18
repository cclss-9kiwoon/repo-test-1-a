extends Area2D
## A collectible coin that grants points when touched.

@export var value: int = 1

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D


func _ready() -> void:
	body_entered.connect(_on_body_entered)


func _on_body_entered(body: Node2D) -> void:
	if body is PlayerController or body is CompanionController:
		GameManager.add_coins(value)
		# TODO: play sfx via AudioManager
		queue_free()
