/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.ProcedureForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.procedureGrid',
    itemId: 'procedureGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        variableHeights: false,
        title: 'Procedures',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [{
            itemId: 'procedures',
            items: [{
                width: 300,
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
                    field: 'code_description',
                    store: 'Procedures',

                    search: function (text) {
                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            },{
                xtype: 'tbspacer',
                height:25
            },{
                xtype: 'button',
                text: 'Constrain search by date range',
                itemId: 'showWhen',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#whenComparator').show();
                        button.up('grid').down('#whenValue').show();
                        button.up('grid').down('#hideWhen').show();
                        button.up('grid').down('#showWhen').hide();
                    }
                }
            },{
                xtype: 'button',
                text: 'Hide date range',
                itemId: 'hideWhen',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#whenComparator').hide();
                        button.up('grid').down('#whenValue').hide();
                        button.up('grid').down('#upperWhenValue').hide();
                        button.up('grid').down('#whenComparator').setValue('');
                        button.up('grid').down('#whenValue').setValue('');
                        button.up('grid').down('#upperWhenValue').setValue('');
                        button.up('grid').down('#hideWhen').hide();
                        button.up('grid').down('#showWhen').show();
                    }
                }
            },{ // When
                xtype: 'combo',
                width: 200,
                anchor: '20%',
                itemId: 'whenComparator',
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
                            combo.up('grid').down('#upperWhenValue').show();
                        } else {
                            combo.up('grid').down('#upperWhenValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                width: 200,
                anchor: '20%',
                itemId: 'whenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                width: 200,
                anchor: '20%',
                itemId: 'upperWhenValue',
                fieldLabel: 'and',
                hidden: true,
                hideTrigger:true
            },{
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitProcedures'
            }]
        }]

    }

});