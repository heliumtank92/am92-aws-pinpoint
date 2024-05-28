import { Substitutions } from '../TYPES'

/**
 * Replaces placeholders in a template string with corresponding values from a substitutions object.
 *
 * @export
 * @param {string} [template='']
 * @param {Substitutions} [substitutions={}]
 * @returns {string}
 */
export default function templatize(
  template: string = '',
  substitutions: Substitutions = {}
): string {
  let templateData: string = template

  if (!templateData) {
    return templateData
  }

  const substitutionKeys: string[] = Object.keys(substitutions)

  substitutionKeys.forEach((key: string) => {
    let value: number | string | undefined | null = substitutions[key]
    if (value === undefined || value === null) {
      value = ''
    }

    templateData = templateData.replaceAll(`{{${key}}}`, value.toString())
  })

  return templateData
}
