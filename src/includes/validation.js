import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  is_not
} from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('password_mismatch', confirmed)
    defineRule('is_not', is_not)
    defineRule('is_not_country', is_not)

    configure({
      // generateMessage: (ctx) => {
      //   const messages = {
      //     required: `The ${ctx.field} field is required.`,
      //     min: `The ${ctx.field} field is too short.`,
      //     max: `The ${ctx.field} field is too long.`,
      //     alpha_spaces: `The ${ctx.field} field may only contain alphabetic characters as well as spaces.`,
      //     email: `The ${ctx.field} field must be a valid email.`,
      //     min_value: `The ${ctx.field} field is too low.`,
      //     max_value: `The ${ctx.field} field is too high.`,
      //     password_mismatch: `The passwords do not match.`,
      //     is_not: `You are not allowed to use this value for the ${ctx.field} field.`,
      //     is_not_country: `Due to restrictions, we do not accept users from this country.`,
      //     tos: `You must agree to the terms of service.`
      //   }

      //   const message = messages[ctx.rule.name] || `The ${ctx.field} field is invalid.`

      //   return message
      // },
      generateMessage: localize({
        en: {
          messages: {
            required: `The {field} field is required.`,
            min: `The {field} field is too short.`,
            max: `The {field} field is too long.`,
            alpha_spaces: `The {field} field may only contain alphabetic characters as well as spaces.`,
            email: `The {field} field must be a valid email.`,
            min_value: `The {field} field is too low.`,
            max_value: `The {field} field is too high.`,
            password_mismatch: `The passwords do not match.`,
            is_not: `You are not allowed to use this value for the {field} field.`,
            is_not_country: `Due to restrictions, we do not accept users from this country.`,
            tos: `You must agree to the terms of service.`
          }
        },
        ar: {
          names: {
            name: 'الاسم',
            age: 'العمر',
            country: 'البلد',
            genre: 'النوع',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirm_password: 'تأكيد كلمة المرور',
            tos: 'شروط الخدمة',
            comment: 'التعليق',
            modified_name: 'عنوان الأغنية'
          },
          messages: {
            required: `حقل {field} مطلوب.`,
            min: `حقل {field} قصير جدا.`,
            max: `حقل {field} طويل جدا.`,
            alpha_spaces: `حقل {field} يمكن أن يحتوي على حروف فقط.`,
            email: `حقل {field} يجب أن يكون بريد إلكتروني صحيح.`,
            min_value: `حقل {field} قيمته صغيرة جدا.`,
            max_value: `حقل {field} قيمته كبيرة جدا.`,
            password_mismatch: `كلمتا المرور غير متطابقتان.`,
            is_not: `لا يمكنك استخدام هذه القيمة في حقل {field}.`,
            is_not_country: `نحن لا نقبل مستخدمين من هذا البلد بسبب القيود.`,
            tos: `يجب أن توافق على شروط الخدمة.`
          }
        }
      }),
      validateOnInput: false,
      validateOnBlur: true,
      validateOnModelUpdate: true,
      validateOnChange: true
    })
  }
}
