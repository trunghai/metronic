<?xml version="1.0" encoding="UTF-8"?>
  <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/edit">
          <table width='100%' align='center' class='recycler-table-ebank '>
            <xsl:for-each select="section">
              <tr class="recycler-row-normal recycler-hover recycler-header-hightlight">
                <td colspan="2" align="center" class="content-detail">
                  <div class="input-group">
                    <span class="input-group-addon" style="width:40%; white-space:pre-wrap" ><b><xsl:value-of select="title"/></b></span>
                    <input onkeyup="controlInputText(this, 40)" id="{inputId}" type="tel" class="form-control form-control-righttext" value="{inputValue}">
                    <xsl:if test="disabled='disabled'">
                      <xsl:attribute name="disabled">
                        <xsl:value-of select="disabled" /></xsl:attribute>
                    </xsl:if>
                    </input>
                  </div>
                </td>
              </tr>
            </xsl:for-each>
            <!--<tr>-->
              <!--<td colspan="2">-->
                <!--<table class="button-group button-group-2" style="margin-top: 15px">-->
                  <!--<tr>-->
                    <!--<td>-->
                      <!--<input type="button" class='btnshadow btn-primary' onclick='cancelEdit()' value="REVIEW_BTN_CANCEL" />-->
                    <!--</td>-->
                    <!--<td>-->
                      <!--<input type="button" class='btnshadow btn-primary' onclick='saveBeneficiary({beneId})' value="TRANSFER_REMITTANCE_MODIFY">-->
                      <!--<xsl:if test="disabled">-->
                        <!--<xsl:attribute name="disabled">true</xsl:attribute>-->
                      <!--</xsl:if>-->
                      <!--</input>-->
                    <!--</td>-->
                  <!--</tr>-->
                <!--</table>-->
              <!--</td>-->
            <!--</tr>-->
              <table class="button-group button-group-2" style="margin-top: 15px">
                  <tr>
                      <td>
                          <input type="button" class='btnshadow btn-primary' onclick='cancelEdit()' value="REVIEW_BTN_CANCEL" />
                      </td>
                      <td>
                          <input type="button" class='btnshadow btn-primary' onclick='saveBeneficiary({beneId})' value="TRANSFER_REMITTANCE_MODIFY">
                              <xsl:if test="disabled">
                                  <xsl:attribute name="disabled">true</xsl:attribute>
                              </xsl:if>
                          </input>
                      </td>
                  </tr>
              </table>
          </table>
    </xsl:template>
  </xsl:stylesheet>
