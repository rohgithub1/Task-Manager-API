const { fahranheitToCelsius, celciusToFahranheit, add } = require("../src/math");

test('Conversion of Fahranheit to Celcius', ()=>{
    const temp = fahranheitToCelsius(32)
    expect(temp).toBe(0)
})  

test('Conversion of Celcius to Fahranheit', ()=>{
    const temp = celciusToFahranheit(0)
    expect(temp).toBe(32)
}) 

test('Using async function', (done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})