def add():
    a = int(input('enter first number : '))
    b = int(input('enter second number : '))
    print('the sum or a and b is :', a+b )

def substarct():
    a = int(input('enter first number :'))
    b = int(input('enter second number : '))
    print('whn b is substract from a the :' ,a-b)

def division():
    a = int(input('enter first number : '))
    b = int(input('enter second number : '))
    print('when a is divided by b then : ',a/b)

def multiplication():
    a = int(input('enter first number : '))
    b = int(input('enter second number : '))
    print('the product of a andb is : ',a*b)

def exponent():
    a = int(input('enter first number : '))
    b = int(input('enter second number ; '))
    print('when b is power of a : ',a**b)

while True:
    print(' add\n substract\n division\n multiplication\n exponent\n exit ')
    choice = input(' enter ur choice : ').lower()
    if choice=='add':
        add()
    elif choice=='substract':
        substarct()
    elif choice=='division':
        division()
    elif choice=='multiplication':
        multiplication()
    elif choice=='exponent':
        exponent()
    elif choice=='exit':
        break
    else:
        print('something went wrong try again ')