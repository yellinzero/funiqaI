import orjson


def json_dumps(*args, **kwargs) -> str:
    return orjson.dumps(*args, **kwargs).decode()


def json_loads(*args, **kwargs):
    return orjson.loads(*args, **kwargs)