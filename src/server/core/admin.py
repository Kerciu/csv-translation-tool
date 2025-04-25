from translation_module import translate


def some_admin_function():
    result = translate("Hello world")
    print(result)


some_admin_function()