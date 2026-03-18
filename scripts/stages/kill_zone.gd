extends Area2D
## Respawns the player when they fall off the map.


func _ready() -> void:
	body_entered.connect(_on_body_entered)


func _on_body_entered(body: Node2D) -> void:
	if body is PlayerController:
		body.respawn()
