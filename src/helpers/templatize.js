export default function templatize (Template = '', Substitutions = {}) {
  let TemplateData = Template

  if (!TemplateData) { return TemplateData }

  const substitutionKeys = Object.keys(Substitutions)

  substitutionKeys.forEach(key => {
    let value = Substitutions[key]
    if (value === undefined || value === null) { value = '' }

    TemplateData = TemplateData.replaceAll(`{{${key}}}`, value)
  })

  return TemplateData
}
