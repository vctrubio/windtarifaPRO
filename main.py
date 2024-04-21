import os
import sys
import argparse
from read import read_db_timenow, read_db_date, read_db_all
from api import api_call

actions = {
    'call': api_call,
    'all': read_db_all,
    'date': read_db_date,
    'time': read_db_timenow,
    '0': sys.exit,
    'exit': sys.exit
}

def main_loop():
    msg = '\n'.join(f"\033[93m{key}\033[0m > \033[97m{value.__name__}\033[0m" for key, value in actions.items())
    print(msg)
    
    try:
        while True:
            choice = input("> ")
            action = actions.get(choice)
            if action:
                action()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        
def main():
    if len(sys.argv) == 1:
        os.system('clear')
        main_loop()
        return
    
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=actions.keys(), help="Command to execute")
    args = parser.parse_args()

    if args.command == 'date':
        print(read_db_date())
    elif args.command == 'time':
        print(read_db_timenow())
    elif args.command == 'all':
        print(read_db_all())
    elif args.command == 'call':
        api_call()

if __name__ == "__main__":
    main()
