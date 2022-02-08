import requests

while True:
    user_input = input('What would you like to do? ')

    if user_input.lower() == 'create user':
        id = input('ID: ')
        username = input('Username: ')
        first_name = input('First Name: ')
        last_name = input('Last Name: ')
        if first_name == '':
            first_name = None
            last_name = None

        elif last_name == '':
            last_name == None

        response = requests.post('http://localhost:3000/user', json={
            "id": id,
            "username": username,
            "firstName": first_name,
            "lastName": last_name
        })

        print(response.json())

    elif user_input.lower() == 'create group':
        title = input('Title: ')
        description = input('Description: ')

        response = requests.post('http://localhost:3000/group', json={
            'title': title,
            'description': description
        })

        print(response.json())

    elif user_input.lower() == 'create post':
        userId = input('User ID: ')
        groupId = input('Group ID: ')
        title = input('Title: ')
        content = input('Content: ')

        response = requests.post('http://localhost:3000/post', json={
            'authorId': userId,
            'groupId': int(groupId),
            'title': title,
            'content': content
        })

        print(response.json())

    elif user_input.lower() == 'create general token':
        id = input('Token ID: ')
        title = input('Token Title: ')
        description = input('Token Description: ')

        response = requests.post('http://localhost:3000/general-token', json={
            'id': id,
            'title': title,
            'description': description
        })

        print(response.json())

    elif user_input.lower() == 'update general token':
        id = input('Token ID: ')
        title = input('New Token Title: ')
        description = input('New Token Description: ')

        payload = {}

        if title != '':
            payload['title'] = title

        if description != '':
            payload['description'] = description

        response = requests.put(
            f'http://localhost:3000/general-token/{id}', json=payload)
        print(response.json())
