﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.MiniBlog.Blog.Dtos;

namespace Abp.MiniBlog.Blog
{
    public interface IBlogAppService
    {
        Task<List<BlogListOutput>> GetListAsync(GetBlogListInput input);
        Task<BlogEditOutput> GetEditAsync(Guid id);
        Task<BlogDetailOutput> GetDetailAsync(EntityDto<Guid> input);
        Task<Guid> CreateAsync(CreateBlogInput input);
        Task<BlogDto> Update(BlogDto input);
        Task DeleteAsync(EntityDto<Guid> input);
    }
}