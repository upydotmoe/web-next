export interface IVerifyAccountPassphrase {
  username: string,
  email: string,
  passphrase: string
}

export interface IVerifyAccountPassphraseNewPassword {
  new: string,
  verify: string
}