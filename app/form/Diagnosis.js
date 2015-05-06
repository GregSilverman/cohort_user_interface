/**
 * Widget to render to Main view
 */

Ext.define('cardioCatalogQT.form.Diagnosis', {
    extend: 'Ext.form.Panel',
    alias : 'widget.diagnosisForm',
    config: {
        variableHeights: false,
        title: 'Diagnoses',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            labelWidth: 100
        },
        items: [{ //Dx
            width: 100,
            anchor: '25%',
            xtype: 'multiselector',
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
                field: 'description',
                store: 'Diagnoses',

                search: function (text) {
                    cardioCatalogQT.service.UtilityService.multi_select_search(text, this);
                }
            }
        },{
            xtype: 'tbspacer',
            height:25
        }, { //TODO: Add hide control
            xtype: 'button',
            text: 'Constrain search by date range',
            itemId: 'showWhen',
            hidden: false,
            listeners: {
                click: function (button) {
                    button.up('form').down('#diagnosisWhenComparator').show();
                    button.up('form').down('#diagnosisWhenValue').show();
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
                    button.up('form').down('#diagnosisWhenComparator').hide();
                    button.up('form').down('#diagnosisWhenValue').hide();
                    button.up('form').down('#upperDiagnosisWhen').hide();
                    button.up('form').down('#diagnosisWhenComparator').setValue('');
                    button.up('form').down('#diagnosisWhenValue').setValue('');
                    button.up('form').down('#upperDiagnosisWhen').setValue('');
                    button.up('form').down('#hideWhen').hide();
                    button.up('form').down('#showWhen').show();
                }
            }
        },{ // When
            xtype: 'combo',
            width: 100,
            anchor: '20%',
            itemId: 'diagnosisWhenComparator',
            queryMode: 'local',
            editable: false,
            value: 'eq',
            triggerAction: 'all',
            forceSelection: true,
            fieldLabel: 'Select diagnosis date that is',
            displayField: 'name',
            hidden: true,
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
                        combo.up('form').down('#upperDiagnosisWhen').show();
                    } else {
                        combo.up('form').down('#upperDiagnosisWhen').hide();
                    }
                }
            }
        }, {
            xtype: 'datefield',
            width: 100,
            anchor: '20%',
            itemId: 'diagnosisWhenValue',
            fieldLabel: 'value of',
            hidden: true,
            hideTrigger:true
        }, {
            xtype: 'datefield',
            width: 100,
            anchor: '20%',
            itemId: 'upperDiagnosisWhen',
            fieldLabel: 'and',
            hidden: true,
            hideTrigger:true
        }],
        lbar: [{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitDiagnoses'
        }]
    }

});
