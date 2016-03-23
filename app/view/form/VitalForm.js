/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.VitalForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vitalGrid',
    itemId: 'vitalGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        title: 'Vitals',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            //anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [{
            itemId: 'vitals',
            bodyStyle: 'margin: 10px; padding: 5px 3px;',
            items: [ {
                width: 600,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitVitals'
            },{
                xtype: 'tbspacer',
                height:5
            },{ // Vitals
                xtype: 'combo',
                flex: 1,
                width: 400,
                itemId: 'measureCode',
                queryMode: 'local',
                editable: false,
                value: 'select',
                triggerAction: 'all',
                forceSelection: true,
                loading: true,
                fieldLabel: 'Select vital measure type',
                displayField: 'measure',
                valueField: 'field_name',
                store: 'BasicVitals',
                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value !== 'select') {
                            combo.up('grid').down('#measureComparator').show();
                        } else {
                            combo.up('grid').down('#measureComparator').hide();
                            combo.up('grid').down('#measureValue').hide();
                            combo.up('grid').down('#upperMeasureValue').hide();
                            combo.up('grid').down('#measureComparator').setValue('');
                            combo.up('grid').down('#measureValue').setValue('');
                            combo.up('grid').down('#upperMeasureValue').setValue('');
                        }
                        // set label with units
                        if (value) {
                            record = this.getSelectedRecord();
                            console.log(record.raw.units);
                            units = record.raw.units;
                            console.log(combo.up('grid').down('#measureValue'))
                            if (record.raw.units) {
                                combo.up('grid').down('#measureValue').setFieldLabel('min value in ' + Ext.util.Format.lowercase(units));
                            }
                            else {
                                combo.up('grid').down('#measureValue').setFieldLabel('min value:');
                            }
                        }
                    }
                }
            },{
                xtype: 'fieldcontainer',
                margin: '0 5 0 0',
                combineErrors: true,
                msgTarget : 'side',
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    hideLabel: true
                },
                items: [{
                    xtype: 'fieldset',
                    title: 'Constrain measure value',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'combo',
                        flex: 1,
                        itemId: 'measureComparator',
                        queryMode: 'local',
                        editable: false,
                        width: 300,
                        value: '',
                        triggerAction: 'all',
                        forceSelection: true,
                        fieldLabel: 'that is',
                        displayField: 'name',
                        valueField: 'value',
                        //hidden: true,
                        store: {
                            fields: ['name', 'value'],
                            data: [
                                {name: 'all', value: 'prn'},
                                {name: '=', value: 'eq'},
                                {name: '< (less than)', value: 'lt'},
                                {name: '<= (less than or equal)', value: 'lete'},
                                {name: '> (greater than)', value: 'gt'},
                                {name: '>= (greater than or equal)', value: 'grte'},
                                {name: 'between', value: 'bt'}
                            ]
                        },
                        listeners: {
                            change: function (combo, value) {
                                // use component query to  toggle the hidden state of upper value
                                if (value === 'bt') {
                                    combo.up('grid').down('#upperMeasureValue').show();
                                } else {
                                    combo.up('grid').down('#upperMeasureValue').hide();
                                }
                                if (value === 'prn') {
                                    combo.up('grid').down('#measureValue').hide();
                                } else {
                                    combo.up('grid').down('#measureValue').show();
                                }
                            }
                        }
                    },{
                        xtype: 'fieldcontainer',
                        combineErrors: true,
                        msgTarget : 'side',
                        defaults: {
                            flex: 1,
                            hideLabel: true
                        },
                        items: [{
                            xtype: 'textfield',
                            itemId: 'measureValue',
                            value: ''
                        },
                            {
                                xtype: 'numberfield',
                                itemId: 'upperMeasureValue',
                                fieldLabel: 'and',
                                hidden: true
                            }]
                    }]
                }, {
                    xtype: 'fieldset',
                    border: false,
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain search by date range',
                        itemId: 'showWhen',
                        hidden: false,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#whenId').show();
                                button.up('grid').down('#whenValue').show();
                                button.up('grid').down('#hideWhen').show();
                                button.up('grid').down('#showWhen').hide();
                            }
                        }
                    }, {
                        xtype: 'button',
                        text: 'Hide date range',
                        itemId: 'hideWhen',
                        hidden: true,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#whenId').hide();
                                button.up('grid').down('#whenValue').hide();
                                button.up('grid').down('#upperWhenValue').hide();
                                button.up('grid').down('#whenComparator').setValue('');
                                button.up('grid').down('#whenValue').setValue('');
                                button.up('grid').down('#upperWhenValue').setValue('');
                                button.up('grid').down('#hideWhen').hide();
                                button.up('grid').down('#showWhen').show();
                            }
                        }
                    }, {
                        xtype: 'fieldset',
                        title: 'Constrain by date',
                        hidden: true,
                        itemId: 'whenId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // When
                            xtype: 'combo',
                            width: 300,
                            itemId: 'whenComparator',
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select measure date that is',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: '<= (less than or equal)', value: 'le'},
                                    {name: '>= (greater than or equal)', value: 'ge'},
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
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget: 'side',
                            defaults: {
                                hideLabel: true
                            },
                            items: [{
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'whenValue',
                                fieldLabel: 'value of',
                                hideTrigger: true
                            }, {
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'upperWhenValue',
                                fieldLabel: 'and',
                                hidden: true,
                                hideTrigger: true
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }
});