const handleName = (name: string, type: 'user' | 'room') => {
  if (name.length > 18 && type === 'user') return name.slice(0, 18) + '...'
  if (name.length > 38 && type === 'room') return name.slice(0, 38) + '...'

  return name 
}

export default handleName