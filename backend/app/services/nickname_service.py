from random import choice, randint


def generate_nickname() -> str:
    prefixes = ["雾岛", "晚风", "夜航", "月影", "静海", "微光"]
    suffixes = ["旅人", "信箱", "星图", "回声", "邮差", "候鸟"]
    return f"{choice(prefixes)}{choice(suffixes)} {randint(10, 99)}"
