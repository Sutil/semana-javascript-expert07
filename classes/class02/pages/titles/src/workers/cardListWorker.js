
onmessage = ({data}) => {
  let counter = 0
  console.log('activating blocking operation...', data.maxItems)
  
    
  for (; counter < data.maxItems; counter++) console.log('.')
  

  postMessage(
    { response: 'ok', data: counter }
  )
}

