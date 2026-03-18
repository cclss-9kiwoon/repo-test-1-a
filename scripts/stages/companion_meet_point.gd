extends Area2D
## Trigger area where the player meets a new companion.

@export var companion_name: String = ""
var triggered: bool = false


func _ready() -> void:
	body_entered.connect(_on_body_entered)


func _on_body_entered(body: Node2D) -> void:
	if triggered:
		return
	if body is PlayerController:
		triggered = true
		var stage = get_parent()
		while stage and not (stage is StageBase):
			stage = stage.get_parent()
		if stage:
			stage.trigger_companion_meeting(companion_name)
