from backend.app.schemas.room import RoomStateResponse
from backend.app.services.matching_service import ROOM_LABELS, normalize_vibe_key
from backend.app.services.realtime_service import room_connection_manager


def get_room_state(room_id: str) -> RoomStateResponse:
    vibe_key, _, maybe_intensity = room_id.partition("-")
    vibe_key = normalize_vibe_key(vibe_key)
    return RoomStateResponse(
        room_id=room_id,
        vibe_key=vibe_key,
        vibe_label=ROOM_LABELS.get(vibe_key, ROOM_LABELS["mixed"]),
        emotion_bucket=vibe_key,
        intensity_bucket=maybe_intensity or "3",
        participant_count=room_connection_manager.participant_count(room_id),
        status="connected" if room_connection_manager.participant_count(room_id) > 0 else "waiting",
    )
