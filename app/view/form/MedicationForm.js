/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.MedicationForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.medicationGrid',
    itemId: 'medicationGrid',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        variableHeights: false,
        title: 'Medications',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [{
            itemId: 'medications',
            items: [{
                width: 300,
                anchor: '25%',
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
            },{
                xtype: 'button',
                text: 'Constrain search by date range',
                itemId: 'showWhen',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#whenComparator').show();
                        button.up('form').down('#whenValue').show();
                        button.up('form').down('#hideWhen').show();
                        button.up('form').down('#showWhen').hide();
                    }
                }
            },{
                xtype: 'button',
                text: 'Hide date range',
                itemId: 'hideWhen',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#whenComparator').hide();
                        button.up('form').down('#whenValue').hide();
                        button.up('form').down('#upperWhenValue').hide();
                        button.up('form').down('#whenComparator').setValue('');
                        button.up('form').down('#whenValue').setValue('');
                        button.up('form').down('#upperWhenValue').setValue('');
                        button.up('form').down('#hideWhen').hide();
                        button.up('form').down('#showWhen').show();
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
                fieldLabel: 'Select medication date that is',
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
                            combo.up('form').down('#upperWhenValue').show();
                        } else {
                            combo.up('form').down('#upperWhenValue').hide();
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
                //minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitMedications'
            }]
        }]

    }

});