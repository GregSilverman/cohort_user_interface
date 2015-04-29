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
            anchor: '25%',
            labelWidth: 100
        },
        items: [{ //Dx
            width: 100,
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
        },{ // When
            xtype: 'combo',
            width: 200,
            itemId: 'diagnosisWhenComparator',
            queryMode: 'local',
            editable: false,
            value: 'eq',
            triggerAction: 'all',
            forceSelection: true,
            fieldLabel: 'Select diagnosis date that is',
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
                        combo.up('form').down('#upperDiagnosisWhen').show();
                    } else {
                        combo.up('form').down('#upperDiagnosisWhen').hide();
                    }
                }
            }
        }, {
            xtype: 'datefield',
            width: 200,
            itemId: 'diagnosisWhenValue',
            fieldLabel: 'value of',
            hideTrigger:true
        }, {
            xtype: 'datefield',
            width: 200,
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
