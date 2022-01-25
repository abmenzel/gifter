export const serialize = (obj: any) => {
    return Object.keys(obj).reduce((acc: any, key: any) => {
        if (obj[key] !== undefined) {
            acc.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        }
        return acc
    }, []).join('&')
}