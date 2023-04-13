const getDisplayStringFromNumber = (value: number) => {
    return parseFloat(value.toFixed(6)).toString()
}

export default getDisplayStringFromNumber