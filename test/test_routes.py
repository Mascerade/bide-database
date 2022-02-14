import requests
import yaml

while True:
    user_input = input('What would you like to do? ').lower()

    # User
    if user_input == 'create user':
        id = input('User ID: ')
        username = input('Username: ')
        first_name = input('First Name: ')
        last_name = input('Last Name: ')

        if first_name == '':
            first_name = None
            last_name = None

        elif last_name == '':
            last_name == None

        response = requests.post('http://localhost:3000/user', json={
            'id': id,
            'username': username,
            'firstName': first_name,
            'lastName': last_name
        })

        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'delete user':
        userId = input('User ID: ')

        response = requests.delete(f'http://localhost:3000/user/{userId}')
        print(yaml.dump(response.json(), default_flow_style=False))

    if user_input == 'update user':
        id = input('User ID: ')
        username = input('Username: ')
        first_name = input('First Name: ')
        last_name = input('Last Name: ')
        payload = {}
        if username != '':
            payload['username'] = username

        if first_name != '':
            payload['firstName'] = first_name

        if last_name != '':
            payload['lastName'] = last_name

        response = requests.put(
            f'http://localhost:3000/user/{id}', json=payload)

        print(yaml.dump(response.json(), default_flow_style=False))

    if user_input == 'get user':
        id = input('User ID: ')

        response = requests.get(f'http://localhost:3000/user/{id}')
        print(yaml.dump(response.json(), default_flow_style=False))

    if user_input == 'get user posts':
        id = input('User ID: ')

        response = requests.get(f'http://localhost:3000/user-posts/{id}')
        print(yaml.dump(response.json(), default_flow_style=False))

    # Group
    elif user_input == 'create group':
        userId = input('UserID: ')
        title = input('Title: ')
        description = input('Description: ')

        response = requests.post('http://localhost:3000/group', json={
            'userId': userId,
            'groupData': {
                'title': title,
                'description': description
            }
        })

        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'get group users':
        id = input('GroupID: ')

        response = requests.get(f'http://localhost:3000/group-users/{id}')
        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'get group posts':
        id = input('GroupID: ')

        response = requests.get(f'http://localhost:3000/group-posts/{id}')
        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'delete group':
        id = input('GroupID: ')

        response = requests.delete(f'http://localhost:3000/group/{id}')
        print(yaml.dump(response.json(), default_flow_style=False))

    # Post
    elif user_input == 'create post':
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

        print(yaml.dump(response.json(), default_flow_style=False))

    # General Token
    elif user_input == 'create general token':
        id = input('Token ID: ')
        title = input('Token Title: ')
        description = input('Token Description: ')

        response = requests.post('http://localhost:3000/general-token', json={
            'id': id,
            'title': title,
            'description': description
        })

        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'update general token':
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
        print(yaml.dump(response.json(), default_flow_style=False))
