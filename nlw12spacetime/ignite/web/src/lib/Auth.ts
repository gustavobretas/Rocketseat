import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUser(token: string): User {
  try {
    const user: User = decode(token)

    return user
  } catch (error) {
    return <User>{}
  }
}
