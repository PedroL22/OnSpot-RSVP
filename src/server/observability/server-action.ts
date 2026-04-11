import { unstable_rethrow } from 'next/navigation'

type ObserveAttributes = Record<string, unknown>

type ServerActionContext = {
  observe: {
    setAttributes: (attributes: ObserveAttributes) => void
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}

export const withServerAction = <Args extends unknown[], Return>(
  actionName: string,
  handler: (context: ServerActionContext, ...args: Args) => Promise<Return>
) => {
  return async (...args: Args): Promise<Return> => {
    const startedAt = Date.now()
    const attributes: ObserveAttributes = {}
    let result: Return | undefined
    let thrown: unknown

    const context: ServerActionContext = {
      observe: {
        setAttributes: (nextAttributes) => {
          Object.assign(attributes, nextAttributes)
        },
      },
    }

    try {
      result = await handler(context, ...args)
    } catch (error) {
      thrown = error
    }

    const inferredSuccess =
      typeof attributes.success === 'boolean'
        ? attributes.success
        : typeof result === 'object' && result !== null && 'success' in result && typeof result.success === 'boolean'
          ? result.success
          : thrown === undefined

    const payload = {
      action: actionName,
      durationMs: Date.now() - startedAt,
      error: thrown && !inferredSuccess ? getErrorMessage(thrown) : undefined,
      success: inferredSuccess,
      timestamp: new Date().toISOString(),
      type: 'server_action',
      ...attributes,
    }

    console.info(JSON.stringify(payload))

    if (thrown) {
      unstable_rethrow(thrown)
      throw thrown
    }

    return result as Return
  }
}
