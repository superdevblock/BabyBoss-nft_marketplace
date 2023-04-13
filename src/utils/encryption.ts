import crypto from 'crypto'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAx+Oe31IzmeTrQ6rJu7tP
n8gcsbAWlTPbdZYA1xp/J23AnVy+8bknGsz+21hY6i4ThZ1/bPKxccKeRhPSD0j1
L/TY0wpVMLu9v/U9ALakLaACHBsyU0Ldd15NRd7KadQW+aFBmFHPG/wVGY6D7i6I
6/PQL1D/78xJjJReVRSgyy9o3cW32yXevOn9gcmmgk6ynTYBADds6QmLOCGHNvB8
MGuEDIsCTSY2d/gXNYytlUktY2jg1uYD94nGj3/6yg2Xv1UtERwdbWaktE6wydXq
lBvAeqNqwLRrZzqqWxR0kXtz5a7fAzKxnl+6meA9miEvJUf06e4968I8lRueOpr7
J64X7HwujZ2W6ALmG2py4PaGo4hadIVhb86u2FkRVlz5FuSpKJ73GIfukAt8LDMO
/Qt9x/VRblHPfGxYtsjG/uT0qSYUTHSkqWrI1QOOORjKwDaXox/2GVAw6d2x3yvI
o7bPJfugDk3rmxzXWiPE+ngnhdR51jBnP9zHVNHQIskAzHYl4PLrwXmXZcv1sZkY
K0EZL6RoUWL1gZ/yCC+L9HQI/crpZmgjhQ2nxxgQ6tKJu+7VV01M2AlXV5pj6FJE
/UspjlBDOhwIQFx7kQmyzFznGYHOrDVlob4/4mImY5Y7jvsaRCiGNlc/az8ahtAm
WdRfURbjq28qt+F/GTiyyg0CAwEAAQ==
-----END PUBLIC KEY-----`

const encryptParams = (params: any) => {
  var buffer = Buffer.from(JSON.stringify(params))
  var encrypted = crypto.publicEncrypt(publicKey, buffer)
  return encrypted.toString("base64")
}

export default encryptParams