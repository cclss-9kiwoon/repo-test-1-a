class_name PlayerController
extends CharacterBody2D
## Mickey's player-controlled movement with state machine.

signal state_changed(new_state: String)

enum State {
	IDLE,
	WALKING,
	JUMPING,
	FALLING,
	CROUCHING,
	CROUCH_WALKING,
	COLLECTING,
}

# Movement parameters (tunable)
@export var move_speed: float = 300.0
@export var jump_velocity: float = -500.0
@export var gravity: float = 980.0
@export var crouch_speed: float = 150.0
@export var coyote_time: float = 0.1
@export var jump_buffer_time: float = 0.1

var current_state: State = State.IDLE
var was_on_floor: bool = false
var coyote_timer: float = 0.0
var jump_buffer_timer: float = 0.0
var facing_right: bool = true

@onready var sprite: AnimatedSprite2D = $AnimatedSprite2D
@onready var collision_shape: CollisionShape2D = $CollisionShape2D
@onready var standing_shape: RectangleShape2D = preload("res://data/shapes/standing_shape.tres") if ResourceLoader.exists("res://data/shapes/standing_shape.tres") else null
@onready var crouching_shape: RectangleShape2D = preload("res://data/shapes/crouching_shape.tres") if ResourceLoader.exists("res://data/shapes/crouching_shape.tres") else null


func _ready() -> void:
	# Create default collision shape if resources don't exist
	if collision_shape and not collision_shape.shape:
		var shape = RectangleShape2D.new()
		shape.size = Vector2(32, 48)
		collision_shape.shape = shape


func _physics_process(delta: float) -> void:
	_update_timers(delta)
	_apply_gravity(delta)
	_handle_input()
	_update_state()
	_update_animation()
	move_and_slide()
	was_on_floor = is_on_floor()


func _update_timers(delta: float) -> void:
	# Coyote time: allow jumping briefly after leaving a platform
	if was_on_floor and not is_on_floor() and velocity.y >= 0:
		coyote_timer = coyote_time
	if coyote_timer > 0:
		coyote_timer -= delta

	# Jump buffer: register jump input slightly before landing
	if Input.is_action_just_pressed("jump"):
		jump_buffer_timer = jump_buffer_time
	if jump_buffer_timer > 0:
		jump_buffer_timer -= delta


func _apply_gravity(delta: float) -> void:
	if not is_on_floor():
		velocity.y += gravity * delta


func _handle_input() -> void:
	var direction = Input.get_axis("move_left", "move_right")
	var is_crouching = Input.is_action_pressed("crouch")
	var can_jump = is_on_floor() or coyote_timer > 0
	var wants_jump = jump_buffer_timer > 0

	# Horizontal movement
	if is_crouching and is_on_floor():
		velocity.x = direction * crouch_speed
	else:
		velocity.x = direction * move_speed

	# Facing direction
	if direction > 0:
		facing_right = true
	elif direction < 0:
		facing_right = false

	# Jump
	if wants_jump and can_jump and not is_crouching:
		velocity.y = jump_velocity
		coyote_timer = 0.0
		jump_buffer_timer = 0.0

	# Variable jump height: release jump early for shorter jump
	if Input.is_action_just_released("jump") and velocity.y < 0:
		velocity.y *= 0.5


func _update_state() -> void:
	var direction = Input.get_axis("move_left", "move_right")
	var is_crouching = Input.is_action_pressed("crouch")
	var old_state = current_state

	if not is_on_floor():
		if velocity.y < 0:
			current_state = State.JUMPING
		else:
			current_state = State.FALLING
	elif is_crouching:
		if abs(direction) > 0.1:
			current_state = State.CROUCH_WALKING
		else:
			current_state = State.CROUCHING
	elif abs(direction) > 0.1:
		current_state = State.WALKING
	else:
		current_state = State.IDLE

	if old_state != current_state:
		state_changed.emit(get_state_name())


func _update_animation() -> void:
	if sprite:
		sprite.flip_h = not facing_right

		match current_state:
			State.IDLE:
				sprite.play("idle")
			State.WALKING:
				sprite.play("walk")
			State.JUMPING:
				sprite.play("jump")
			State.FALLING:
				sprite.play("fall")
			State.CROUCHING:
				sprite.play("crouch")
			State.CROUCH_WALKING:
				sprite.play("crouch_walk")
			State.COLLECTING:
				sprite.play("collect")


func get_state_name() -> String:
	match current_state:
		State.IDLE: return "idle"
		State.WALKING: return "walking"
		State.JUMPING: return "jumping"
		State.FALLING: return "falling"
		State.CROUCHING: return "crouching"
		State.CROUCH_WALKING: return "crouch_walking"
		State.COLLECTING: return "collecting"
	return "idle"


func get_state_record() -> Dictionary:
	return {
		"pos": global_position,
		"state": get_state_name(),
		"flip_h": not facing_right if sprite else false,
		"is_on_floor": is_on_floor()
	}
