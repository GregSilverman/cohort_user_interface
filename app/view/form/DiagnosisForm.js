/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.DiagnosisForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.diagnosisGrid',
    itemId: 'diagnosisGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    config: {
        variableHeights: false,
        title: 'Diagnoses',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [ {
            itemId: 'diagnoses',
            bodyStyle: 'margin: 10px; padding: 5px 3px;',
            items: [{
                width: 600,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitDiagnoses'
            },{
                xtype: 'tbspacer',
                height:5
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
                items: [{ //Dx
                    width: 300,
                    height: 400,
                    anchor: '25%',
                    xtype: 'multiselector',
                    scrollable: true,
                    title: 'Selected Dx',
                    itemId: 'diagnosis',
                    fieldName: 'description',
                    valueField: 'code',
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: 'No Dx selected'
                    },
                    // TODO: fix ability to remove selected items when box is unchecked
                    search: {
                        field: 'code_description',
                        store: 'Diagnoses',

                        search: function (text) {
                            cardioCatalogQT.service.UtilityService.multi_select_search(text, this);
                        },
                        onSelect : function() {
                            Ext.Msg.alert('Change', 'MultiSelect has changed');
                        }
                    }
                },{
                    xtype: 'tbspacer',
                    height:25
                },{
                    xtype: 'fieldset',
                    collapsible: false,
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
                    },{
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
                    },{
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
                            width: 200,
                            itemId: 'whenComparator',
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select lab date that is',
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
                                change: function(combo, value) {
                                    // use component query to  toggle the hidden state of upper value
                                    if (value === 'bt') {
                                        combo.up('grid').down('#upperWhenValue').show();
                                    } else {
                                        combo.up('grid').down('#upperWhenValue').hide();
                                    }
                                }
                            }
                        },{
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget : 'side',
                            defaults: {
                                hideLabel: true
                            },
                            items: [{
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'whenValue',
                                fieldLabel: 'value of',
                                hideTrigger:true
                            },{
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'upperWhenValue',
                                fieldLabel: 'and',
                                hidden: true,
                                hideTrigger:true
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }
});