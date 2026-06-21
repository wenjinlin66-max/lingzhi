from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.session import Session as ChatSession
from backend.app.schemas.matching import (
    MatchRequest,
    MatchResponse,
    MatchRoomSuggestion,
    MatchStrategyGroup,
)
from backend.app.services.icebreaker_service import generate_icebreakers
from backend.app.services.nickname_service import generate_nickname

ROOM_LABELS = {
    "calm": "轻松闲聊",
    "happy": "快乐同频",
    "anxious": "深夜焦虑",
    "sad": "低落互助",
    "angry": "情绪释放",
    "lonely": "晚风陪伴",
    "mixed": "复杂心绪",
}


EMOTION_ALIASES = {
    "joy": "happy",
    "contentment": "calm",
    "relaxation": "calm",
    "sadness": "sad",
    "frustration": "angry",
    "overwhelm": "anxious",
    "overwhelmed": "anxious",
    "loneliness": "lonely",
}

STRATEGY_DEFINITIONS = {
    "similar": ("相似情绪", "找到与你当前情绪最接近、最容易直接开口的匿名房间。"),
    "complementary": ("互补情绪", "匹配更能接住你、回应你，或给出另一种情绪节奏的人群。"),
    "same_room": ("同频房间", "围绕同类心境聚集，更适合快速进入聊天状态。"),
    "group": ("多人情绪聊天室", "适合多人同时在线时围绕同一情绪展开群聊。"),
}

COMPLEMENTARY_VIBE = {
    "calm": "happy",
    "happy": "calm",
    "anxious": "calm",
    "sad": "happy",
    "angry": "calm",
    "lonely": "happy",
    "mixed": "calm",
}


def normalize_vibe_key(vibe_key: str) -> str:
    lowered = vibe_key.lower()
    return EMOTION_ALIASES.get(lowered, lowered)


def build_room_suggestions(vibe_key: str, intensity: int) -> list[MatchStrategyGroup]:
    normalized_vibe = normalize_vibe_key(vibe_key)
    similar_vibe = normalized_vibe
    complementary_vibe = COMPLEMENTARY_VIBE.get(normalized_vibe, "calm")

    strategy_rooms = {
        "similar": [
             (f"{similar_vibe}-mirror-{intensity}", similar_vibe, f"{ROOM_LABELS.get(similar_vibe, ROOM_LABELS['mixed'])}"),
            (f"{similar_vibe}-late-{max(2, intensity - 1)}", similar_vibe, f"深夜{ROOM_LABELS.get(similar_vibe, ROOM_LABELS['mixed'])}"),
        ],
        "complementary": [
             (f"{complementary_vibe}-bridge-{intensity}", complementary_vibe, f"{ROOM_LABELS.get(complementary_vibe, ROOM_LABELS['mixed'])}"),
            (f"{complementary_vibe}-gentle-{min(5, intensity + 1)}", complementary_vibe, f"温柔{ROOM_LABELS.get(complementary_vibe, ROOM_LABELS['mixed'])}"),
        ],
        "same_room": [
             (f"{similar_vibe}-focus-{intensity}", similar_vibe, ROOM_LABELS.get(similar_vibe, ROOM_LABELS["mixed"])),
            (f"{similar_vibe}-echo-{intensity}", similar_vibe, f"{ROOM_LABELS.get(similar_vibe, ROOM_LABELS['mixed'])}回声"),
        ],
        "group": [
              (f"{similar_vibe}-group-{intensity}", similar_vibe, f"{ROOM_LABELS.get(similar_vibe, ROOM_LABELS['mixed'])}多人场"),
            (f"mixed-circle-{intensity}", "mixed", "情绪圆桌"),
        ],
    }

    groups: list[MatchStrategyGroup] = []
    for strategy_key, rooms in strategy_rooms.items():
        strategy_label, description = STRATEGY_DEFINITIONS[strategy_key]
        suggestions = [
            MatchRoomSuggestion(
                room_id=room_id,
                vibe_key=room_vibe,
                vibe_label=ROOM_LABELS.get(room_vibe, ROOM_LABELS["mixed"]),
                room_title=title,
                strategy_key=strategy_key,
                strategy_label=strategy_label,
                participant_count=2 + index,
                connection_state="connected" if index == 0 else "waiting",
                icebreakers=generate_icebreakers(room_vibe),
            )
            for index, (room_id, room_vibe, title) in enumerate(rooms)
        ]
        groups.append(
            MatchStrategyGroup(
                strategy_key=strategy_key,
                strategy_label=strategy_label,
                description=description,
                rooms=suggestions,
            )
        )

    return groups


def match_room(payload: MatchRequest, db: Session) -> MatchResponse:
    vibe_key = normalize_vibe_key(payload.analysis.primary_emotion)
    nickname = generate_nickname()
    avatar_color = vibe_key

    existing_session = db.execute(
        select(ChatSession).where(ChatSession.session_token == payload.session_token)
    ).scalar_one_or_none()

    if existing_session is None:
        existing_session = ChatSession(
            session_token=payload.session_token,
            nickname=nickname,
            avatar_color=avatar_color,
        )
        db.add(existing_session)
    else:
        nickname = existing_session.nickname
        avatar_color = existing_session.avatar_color

    db.commit()

    strategies = build_room_suggestions(vibe_key, payload.analysis.intensity)

    return MatchResponse(
        nickname=nickname,
        avatar_color=avatar_color,
        recommended_strategy="similar",
         strategies=strategies,
    )
