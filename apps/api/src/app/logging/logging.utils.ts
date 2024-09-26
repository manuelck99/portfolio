export function getLoggingMessage(message: string, obj?: unknown): string {
  if (obj === undefined || obj === null) {
    return message
  } else {
    return `${message}:\n${JSON.stringify(obj, null, 2)}`
  }
}
