/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Procedure', {
    extend: 'Ext.form.Panel',
    alias : 'widget.procedureForm',
    config: {
        variableHeights: false,
        title: 'Procedures',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            labelWidth: 100
        },
        items: [{
            width: 100,
            anchor: '25%',
            xtype: 'multiselector',
            title: 'Selected Px',
            itemId: 'procedure',
            fieldName: 'description',
            valueField:'code',
            viewConfig: {
                deferEmptyText: false,
                emptyText: 'No Px selected'
            },
            // TODO: fix ability to remove selected items when box is unchecked
            search: {
                field: 'description',
                store: 'Procedures',

                search: function (text) {
                    cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                }
            }
        },{
            xtype: 'tbspacer',
            height:25
        },{ //TODO: Add hide control
            xtype: 'button',
            text: 'Constrain search by date range',
            listeners: {
                click: function (button) {
                    button.up('form').down('#procedureWhenComparator').show();
                    button.up('form').down('#procedureWhenValue').show();
                }
            }
        },{ // When
            xtype: 'combo',
            width: 100,
            anchor: '10%',
            itemId: 'procedureWhenComparator',
            queryMode: 'local',
            editable: false,
            value: 'eq',
            triggerAction: 'all',
            forceSelection: true,
            fieldLabel: 'Select procedure date that is',
            displayField: 'name',
            valueField: 'value',
            hidden: true,
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
                        combo.up('form').down('#upperProcedureWhen').show();
                    } else {
                        combo.up('form').down('#upperProcedureWhen').hide();
                    }
                }
            }
        }, {
            xtype: 'datefield',
            width: 100,
            anchor: '10%',
            itemId: 'procedureWhenValue',
            fieldLabel: 'value of',
            hidden: true,
            hideTrigger:true
        }, {
            xtype: 'datefield',
            width: 100,
            anchor: '10%',
            itemId: 'upperProcedureWhen',
            fieldLabel: 'and',
            hidden: true,
            hideTrigger:true
        }],
        lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitProcedures'
        }]
    }
});
