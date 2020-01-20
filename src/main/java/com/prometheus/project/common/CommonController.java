package com.prometheus.project.common;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.prometheus.common.utils.security.ShiroUtils;
import com.prometheus.common.utils.spring.SpringUtils;
import com.prometheus.project.system.client.domain.Client;
import com.prometheus.project.system.client.service.ClientServiceImpl;
import com.prometheus.project.system.user.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import com.prometheus.common.constant.Constants;
import com.prometheus.common.utils.StringUtils;
import com.prometheus.common.utils.file.FileUploadUtils;
import com.prometheus.common.utils.file.FileUtils;
import com.prometheus.framework.config.PrometheusConfig;
import com.prometheus.framework.config.ServerConfig;
import com.prometheus.framework.web.domain.AjaxResult;

import java.math.BigDecimal;

/**
 * 通用请求处理
 *
 * @author chenzhi
 */
@Controller
public class CommonController {
    private static final Logger log = LoggerFactory.getLogger(CommonController.class);

    @Autowired
    private ServerConfig serverConfig;

    /**
     * 通用下载请求
     *
     * @param fileName 文件名称
     * @param delete   是否删除
     */
    @GetMapping("common/download")
    public void fileDownload(String fileName, Boolean delete, HttpServletResponse response, HttpServletRequest request) {
        try {
            if (!FileUtils.isValidFilename(fileName)) {
                throw new Exception(StringUtils.format("文件名称({})非法，不允许下载。 ", fileName));
            }
            String realFileName = System.currentTimeMillis() + fileName.substring(fileName.indexOf("_") + 1);
            String filePath = PrometheusConfig.getDownloadPath() + fileName;

            response.setCharacterEncoding("utf-8");
            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition",
                    "attachment;fileName=" + FileUtils.setFileDownloadHeader(request, realFileName));
            FileUtils.writeBytes(filePath, response.getOutputStream());
            if (delete) {
                FileUtils.deleteFile(filePath);
            }
        } catch (Exception e) {
            log.error("下载文件失败", e);
        }
    }

    /**
     * 通用上传请求
     */
    @PostMapping("/common/upload")
    @ResponseBody
    public AjaxResult uploadFile(MultipartFile file) throws Exception {
        try {
            // 上传文件路径
            String filePath = PrometheusConfig.getUploadPath();
            // 上传并返回新文件名称
            String fileName = FileUploadUtils.upload(filePath, file);
            String url = serverConfig.getUrl() + fileName;
            AjaxResult ajax = AjaxResult.success();
            ajax.put("fileName", fileName);
            ajax.put("url", url);
            return ajax;
        } catch (Exception e) {
            return AjaxResult.error(e.getMessage());
        }
    }

    /**
     * 本地资源通用下载
     */
    @GetMapping("/common/download/resource")
    public void resourceDownload(String resource, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        // 本地资源路径
        String localPath = PrometheusConfig.getProfile();
        // 数据库资源地址
        String downloadPath = localPath + StringUtils.substringAfter(resource, Constants.RESOURCE_PREFIX);
        // 下载名称
        String downloadName = StringUtils.substringAfterLast(downloadPath, "/");
        response.setCharacterEncoding("utf-8");
        response.setContentType("multipart/form-data");
        response.setHeader("Content-Disposition",
                "attachment;fileName=" + FileUtils.setFileDownloadHeader(request, downloadName));
        FileUtils.writeBytes(downloadPath, response.getOutputStream());
    }


    /**
     * 跳转获取地图页面
     */

    @GetMapping("/common/getLocation/{getLocationType}/{parentId}/{latitude}/{longitude}")
    public String getLocation(@PathVariable("getLocationType") String getLocationType, @PathVariable("parentId") String parentId,
                              @PathVariable("latitude") String latitude, @PathVariable("longitude") String longitude, ModelMap mmap) {
//        if(StringUtils.isNotBlank(getLocationType)){
//            if ("lineAdd".equals(getLocationType)) {
//                //查询机构的经纬度
//                ClientServiceImpl clientServiceImpl = SpringUtils.getBean(ClientServiceImpl.class);
//                Client client = clientServiceImpl.selectClientById(ShiroUtils.getSysUser().getClientId().intValue());
//                //要处理admin操作的情况
//                if (!User.isAdmin(ShiroUtils.getUserId())) {
//                    if(null != client.getLatitude() && null != client.getLongitude()){
//                        latitude = client.getLatitude().toString();
//                        longitude = client.getLongitude().toString();
//                    }
//                }
//            } else if (("termAdd").equals(getLocationType) || (("termEdit").equals(getLocationType) && !("undefined").equals(parentId))) {
//                //新增时根据选择的线路id查询线路的经纬度，编辑时如果选择了新的线路，根据线路id查询线路的经纬度
//                BigDecimal lineID = new BigDecimal(parentId);
//                LinefileServiceImpl linefileServiceImpl = SpringUtils.getBean(LinefileServiceImpl.class);
//                Linefile linefile = linefileServiceImpl.selectLinefileById(lineID);
//                latitude = linefile.getLatitude().toString();
//                longitude = linefile.getLongitude().toString();
//            } else if (("pointAdd").equals(getLocationType) || (("pointEdit").equals(getLocationType) && !("undefined").equals(parentId))) {
//                //新增时根据选择的终端id查询终端的经纬度，编辑时如果选择了新的终端，根据终端id查询线路的经纬度
//                BigDecimal termID = new BigDecimal(parentId);
//                TermfileServiceImpl termfileServiceImpl = SpringUtils.getBean(TermfileServiceImpl.class);
//                Termfile termfile = termfileServiceImpl.selectTermfileById(termID);
//                latitude = termfile.getLatitude().toString();
//                longitude = termfile.getLongitude().toString();
//            }
//        }
        mmap.put("latitude", latitude);
        mmap.put("longitude", longitude);
        return "common/map";
    }

    /**
     * 跳转指令执行 进度条
     */

    @GetMapping("/common/showPercent/{commListIds}" )
    public String showPercent(@PathVariable("commListIds") String commListIds, ModelMap mmap) {
        mmap.put("commListIds", commListIds);
        return "common/showPercent";
    }


    /**
     * 下装通信指令
     */
//    @Autowired
//    private ILampControlService lampControlService;
//
//    @PostMapping("/common/getPercent")
//    @ResponseBody
//    public AjaxResult getPercent(String commListIds) {
//        // 根据 指令id 获取执行成功的数量
//        int total = 1, num = 1;
//        if (StringUtils.isNotEmpty(commListIds)) {
//            String[] ids = commListIds.split(",");
//            total = ids.length;
//            num = lampControlService.commListDoneCount(ids);
//        }
//        AjaxResult ajaxResult = new AjaxResult();
//        ajaxResult.put("total", total);
//        ajaxResult.put("num", num);
//        return ajaxResult;
//    }
}
