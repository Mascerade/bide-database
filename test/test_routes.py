from email.policy import default
import requests
import yaml

while True:
    user_input = input('What would you like to do? ').lower()

    # User
    if user_input == 'create user':
        email = input('Email: ')
        username = input('Username: ')
        first_name = input('First Name: ')
        last_name = input('Last Name: ')
        password = input('Password: ')

        response = requests.post('http://localhost:3000/user', json={
            'email': email,
            'username': username,
            'firstName': first_name,
            'lastName': last_name,
            'password': password
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
        email = input('Email: ')
        password = input('Password: ')
        name = input('Name: ')
        title = input('Title: ')
        description = input('Description: ')

        sess = requests.Session()
        loginData = { 'email': email, 'password': password }
        
        loginResponse = sess.get('http://localhost:3000/user/login', params=loginData)
        print('Login Response:')
        print(yaml.dump(loginResponse.json(), default_flow_style=False))

        groupResponse = sess.post('http://localhost:3000/group', json={
            'groupData': {
                'name': name,
                'title': title,
                'description': description
            }
        })

        print('Group Response:')
        print(yaml.dump(groupResponse.json(), default_flow_style=False))

    elif user_input == 'get group':
        name = input('Group Name: ')

        response = requests.get(f'http://localhost:3000/group/{name}')
        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'get group users':
        name = input('Group Name: ')

        response = requests.get(f'http://localhost:3000/group-users/{name}')
        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'get group posts':
        name = input('Group Name: ')

        response = requests.get(f'http://localhost:3000/group-posts/{name}')
        print(yaml.dump(response.json(), default_flow_style=False))

    elif user_input == 'delete group':
        email = input('Email: ')
        password = input('Password: ')
        id = input('Group ID: ')

        sess = requests.Session()
        loginData = { 'email': email, 'password': password }
        
        loginResponse = sess.get('http://localhost:3000/user/login', params=loginData)
        print('Login Response:')
        print(yaml.dump(loginResponse.json(), default_flow_style=False))

        groupResponse = sess.delete(f'http://localhost:3000/group/{id}')

        print('Group Response:')
        print(yaml.dump(groupResponse.json(), default_flow_style=False))

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
