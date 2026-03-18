class_name CompanionController
extends CharacterBody2D
## A companion character that follows the player via position history.
## Does NOT use physics for movement — position is set directly from the history queue.

@export var character_name: String = ""
@export var display_name: String = ""

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D


func apply_history_record(record: Dictionary) -> void:
	global_position = record.get("pos", global_position)
	var state_name = record.get("state", "idle")
	var flip = record.get("flip_h", false)

	if sprite:
		sprite.flip_h = flip
		_play_animation(state_name)


func _play_animation(state_name: String) -> void:
	if not sprite or not sprite.sprite_frames:
		return

	var anim_name = _map_state_to_animation(state_name)
	if sprite.sprite_frames.has_animation(anim_name):
		if sprite.animation != anim_name:
			sprite.play(anim_name)
	elif sprite.sprite_frames.has_animation("idle"):
		if sprite.animation != "idle":
			sprite.play("idle")


func _map_state_to_animation(state_name: String) -> String:
	match state_name:
		"idle": return "idle"
		"walking": return "walk"
		"jumping": return "jump"
		"falling": return "fall"
		"crouching": return "crouch"
		"crouch_walking": return "crouch_walk"
		"collecting": return "collect"
	return "idle"
