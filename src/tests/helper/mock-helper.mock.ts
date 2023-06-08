import { SizeNotCompatibleError } from './size-not-compatible-error'

const extractKeys = (schema = {}): Array<string> => {
  const keys: string[] = []
  const values = Object.entries(schema)
  values.forEach(([key]) => {
    keys.push(key)
  })
  return keys
}

const valueHasToBeReplaced = (key: string, keysInValues: string[]): boolean => {
  if (keysInValues.length) {
    return keysInValues.includes(key)
  }
  return false
}

const transformToObject = (array: any) => {
  return array.reduce(
    (obj: any, item: any[]) => Object.assign(obj, { [item[0]]: item[1] }),
    {},
  )
}

export const changeValuesMock = <T>(
  schema: T,
  changes?: object | Array<any>,
  replaceInsideListObject = false,
): T => {
  try {
    if (changes) {
      if (Array.isArray(changes) && Array.isArray(schema)) {
        const newSchema = schema.map((data: T, index: number) => {
          return changeValuesMock(data, changes[index], replaceInsideListObject)
        })

        return newSchema as T
      }

      const keysInSchema = extractKeys(changes)

      const schemaToArray = Object.entries(schema)

      const valueToBeReturned: any = schemaToArray.map(([key, value]) => {
        if (value instanceof Date && valueHasToBeReplaced(key, keysInSchema)) {
          return [key, (changes as any)[key]]
        }

        if (Buffer.isBuffer(value) && valueHasToBeReplaced(key, keysInSchema)) {
          return [key, (changes as any)[key]]
        }

        if (
          typeof value === 'object' &&
          !Array.isArray(value) &&
          valueHasToBeReplaced(key, keysInSchema)
        ) {
          return [
            key,
            changeValuesMock(
              value,
              (changes as any)[key],
              replaceInsideListObject,
            ),
          ]
        }

        if (
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (element) =>
              typeof element === 'object' &&
              valueHasToBeReplaced(key, keysInSchema),
          ) &&
          replaceInsideListObject
        ) {
          if (value.length !== (changes as any)[key]?.length) {
            throw new SizeNotCompatibleError(`${key} list size not compatible`)
          }

          return [
            key,
            value.map((dataObject, index) =>
              changeValuesMock(
                dataObject,
                (changes as any)[key][index],
                replaceInsideListObject,
              ),
            ),
          ]
        }

        if (valueHasToBeReplaced(key, keysInSchema)) {
          return [key, (changes as any)[key]]
        }

        return [key, value]
      })
      return transformToObject(valueToBeReturned)
    }

    return schema
  } catch (error) {
    throw new Error('Missing error when replacing values')
  }
}
