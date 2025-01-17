import { expect } from 'chai'

import Builder from '../../src/builder'
import importScript from '../../src/importScript'
import { getCleanItems, removeNonCode, testTypes } from './exportImportCommon.js'

import simpleOneSwitch from '../../src/examples/simple_one_switch'

import minieditScript from './minieditScriptImport.script.py'
const miniedit = importScript(minieditScript).data

describe('Export import script', () => {
  ;[
    { json: simpleOneSwitch, name: 'simple_one_switch' },
    { json: miniedit, name: 'miniedit' }
  ].forEach(({ json: data1, name }) => describe(name, () => {
    const script1 = new Builder(JSON.parse(JSON.stringify(data1))).build()
    const data2 = importScript(script1).data
    const script2 = new Builder(JSON.parse(JSON.stringify(data2))).build()

    testTypes(data2)

    describe('Items', () => {
      // Ports
      it('port', () => {
        const type = 'port'
        const typePl = 'ports'
        const items1 = getCleanItems(data1.items, type)
        const items2 = getCleanItems(data2.items, type)
        expect(items2, `The amount of ${typePl} differs.`).to.have.lengthOf.at.most(items1.length)
        expect(items1, `Some ${typePl} were not imported correctly.`).to.include.deep.members(items2)
      })

        // Other
        ;[
          { type: 'controller', typePl: 'controllers' },
          { type: 'host', typePl: 'hosts' },
          { type: 'link', typePl: 'links' },
          { type: 'switch', typePl: 'switches' }
        ].forEach(({ type, typePl }) => {
          it(type, () => {
            const items1 = getCleanItems(data1.items, type)
            const items2 = getCleanItems(data2.items, type)
            expect(items2, `The amount of ${typePl} differs.`).to.have.lengthOf(items1.length)
            expect(items2, `Some ${typePl} were not imported correctly.`).to.have.deep.members(items1)
          })
        })
    })

    it('script reexport', () => {
      expect(removeNonCode(script2), 'Script changed after importing and reexporting.')
        .to.equal(removeNonCode(script1))
    })
  }))
})
