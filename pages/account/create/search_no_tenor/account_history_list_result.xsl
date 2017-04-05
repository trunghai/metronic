<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
      <table style="width: 98%; margin: auto" class="recycler-table-ebank">
        <tr class="recycler-row-title-header">
          <th class="recycler-row-align-midle" width="15%"><span>ACC_QUERY_TIME</span></th>  
          <th class="recycler-row-align-midle" width="35%"><span>ACC_QUERY_EXPLAIN</span></th>
          <th class="recycler-row-align-midle" width="15%"><span>ACC_QUERY_DEBIT</span></th> <!-- ghi no-->
           <th class="recycler-row-align-midle" width="15%"><span>ACC_QUERY_CREDIT</span></th> <!-- ghi co -->
          <th class="recycler-row-align-midle" width="20%"><span>COM_SURPLUS</span></th> <!-- So du-->
          <th class="recycler-row-align-midle" width="15%"><span>COM_TRANS_CODE</span></th> <!-- tai khoan giao dich-->
        </tr>
        <xsl:for-each select="transTable/rows">
          <tr class="recycler-row-title">
            <td  class="recycler-row-align-midle-left" >
              <div class="mobile-mode"><span>ACC_QUERY_TIME</span></div>
              <div class="content-detail"><span><xsl:value-of select="time" /></span></div>
            </td>
             <td class="recycler-row-align-midle">
              <div class="mobile-mode"><span>ACC_QUERY_EXPLAIN</span></div>
              <div class="content-detail"><span><xsl:value-of select="explain"/></span></div>
            </td>
            <td class="recycler-row-align-midle">
              <div class="mobile-mode"><span>ACC_QUERY_DEBIT</span></div>
              <div class="content-detail"><span><xsl:value-of select="debit" /></span></div>
            </td>
              <td class="recycler-row-align-midle">
              <div class="mobile-mode"><span>ACC_QUERY_CREDIT</span></div>
              <div class="content-detail"><span><xsl:value-of select="credit" /></span></div>
            </td>
            <td class="recycler-row-align-midle-right">
              <div class="mobile-mode"><span>COM_SURPLUS</span></div>
              <div class="content-detail"><span><xsl:value-of select="surplus" /></span></div>
            </td>
            <td>
              <div class="mobile-mode"><span>COM_TRANS_CODE</span></div>
              <div class="content-detail">
                  <a href="javascript:void(0)" id="acchis.exportfile" onclick="sendRequestReportDebit('{transaction}','{debit}','{time}','{entry_sr_no}')"><xsl:value-of select="transaction" /></a>                 
              </div>
            </td>
          </tr>
        </xsl:for-each>
      </table>
    </xsl:template>
  </xsl:stylesheet>

