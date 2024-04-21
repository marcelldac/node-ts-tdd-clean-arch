import type { HttpRequest, HttpResponse } from '../protocols/http'
import type { Controller } from '../protocols/controller'
import type { EmailValidator } from '../protocols/email-validator'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { InvalidParamError } from '../errors/invalid-param-errror'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidator.isValid(String(httpRequest.body.email)) // 👈 TODO: Remove string parse adding type
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
