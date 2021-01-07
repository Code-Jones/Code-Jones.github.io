import json
import random

listSize = 100
wordAmt = 15
wordNums = []
chars = ["{", "}", "[", "]", "'", ":", ";", "/", "?", ".", ",", "<", ">", "(", ")", "-", "_", "*", "&", "^", "%", "$", "#", "@", "!", "~", "`", "|", "\\", "="]
words = ["PLAYER", "ARMIES", "WASTES", "PIECES", "BECOME", "TOSSED", "MIDDLE", "KIDNAP", "KINDLY", "THWART", "SECRET", "HIDDEN", "OFFERS", "BEFORE", "FORGES", "FORCES", "NEEDED", "MINUTE", "LEARNS", "ATTACK", "PERIOD", "INSANE", "ACCESS", "AFRESH", "DESERT", "HUNGRY"]
password = random.randint(0, wordAmt - 1)
print(password)

for i in range(wordAmt):
    t = random.randint(0, listSize)
    while t in wordNums:
        t = random.randint(0, listSize)
    wordNums.append(random.randint(0, listSize))

print(wordNums)


uglyjson = ""

for i in range(listSize):
    if i in wordNums:
        uglyjson += "{ \"name\": \"" + chars[random.randint(0, len(chars) - 1)] + "\", \"type\": " + "\"piece\"" + "}, \n"
    else:
        uglyjson += "{ \"name\": \"" + chars[random.randint(0, len(chars) - 1)] + "\", \"type\": " + "\"piece\"" + "}, \n"

print(uglyjson[:-2])


# print(json.dumps(parsed, indent=2, sort_keys=True))
