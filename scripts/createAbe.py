import json
import sys

def ask_abe():
    json_obj = open(sys.argv[2])

    data = json.load(json_obj)
    answer="placeholder answer"
    # do some your calculations based on X and y and put the result to the calculatedResults
    # print(make_pipeline)
    json_object_result = json.dumps(answer, indent=4)

    with open(sys.argv[3], "w") as outfile:
        outfile.write(json_object_result)
    print("OK")


if sys.argv[1] == 'ask_abe':
    ask_abe()

sys.stdout.flush()