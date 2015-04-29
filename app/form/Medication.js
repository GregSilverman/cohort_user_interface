/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Medication', {
    extend: 'Ext.form.Panel',
    alias : 'widget.medicationForm',
    config: {
        variableHeights: false,
        title: 'Medications',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '25%',
            labelWidth: 100
        },
        items: [{
            width: 100,
            xtype: 'multiselector',
            title: 'Selected Rx',
            itemId: 'medication',
            fieldName: 'description',
            valueField:'code',
            viewConfig: {
                deferEmptyText: false,
                emptyText: 'No Rx selected'
            },
            // TODO: fix ability to remove selected items when box is unchecked
            search: {
                field: 'description',
                store: 'Medications',

                search: function (text) {
                    cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                }
            }
        },{
            xtype: 'tbspacer',
            height:25
        },{ // When
            xtype: 'combo',
            itemId: 'medicationWhenComparator',
            queryMode: 'local',
            editable: false,
            value: 'eq',
            triggerAction: 'all',
            forceSelection: true,
            fieldLabel: 'Select medication date that is',
            displayField: 'name',
            valueField: 'value',
            store: {
                fields: ['name', 'value'],
                data: [
                    {name: '<=', value: 'le'},
                    {name: '>=', value: 'ge'},
                    {name: 'between', value: 'bt'}
                ]
            },

            listeners: {
                change: function (combo, value) {
                    // use component query to  toggle the hidden state of upper value
                    if (value === 'bt') {
                        combo.up('form').down('#upperMedicationWhen').show();
                    } else {
                        combo.up('form').down('#upperMedicationWhen').hide();
                    }
                }
            }
        }, {
            xtype: 'datefield',
            itemId: 'medicationWhenValue',
            fieldLabel: 'value of',
            hideTrigger:true
        }, {
            xtype: 'datefield',
            itemId: 'upperMedicationWhen',
            fieldLabel: 'and',
            hidden: true,
            hideTrigger:true
        }],
        lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitMedications'

        }]
    }

});
