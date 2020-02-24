import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { find, map, tap } from 'rxjs/operators';
import {
  BitstreamFormatsRegistryDeselectAction,
  BitstreamFormatsRegistryDeselectAllAction,
  BitstreamFormatsRegistrySelectAction
} from '../../+admin/admin-registries/bitstream-formats/bitstream-format.actions';
import { BitstreamFormatRegistryState } from '../../+admin/admin-registries/bitstream-formats/bitstream-format.reducers';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { coreSelector } from '../core.selectors';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { BITSTREAM_FORMAT } from '../shared/bitstream-format.resource-type';
import { Bitstream } from '../shared/bitstream.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { DataService } from './data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RemoteData } from './remote-data';
import { DeleteByIDRequest, PostRequest, PutRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';

const bitstreamFormatsStateSelector = createSelector(
  coreSelector,
  (state: CoreState) => state.bitstreamFormats
);
const selectedBitstreamFormatSelector = createSelector(bitstreamFormatsStateSelector,
  (bitstreamFormatRegistryState: BitstreamFormatRegistryState) => bitstreamFormatRegistryState.selectedBitstreamFormats);

/**
 * A service responsible for fetching/sending data from/to the REST API on the bitstreamformats endpoint
 */
@Injectable()
@dataService(BITSTREAM_FORMAT)
export class BitstreamFormatDataService extends DataService<BitstreamFormat> {

  protected linkPath = 'bitstreamformats';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<BitstreamFormat>) {
    super();
  }

  /**
   * Get the endpoint to update an existing bitstream format
   * @param formatId
   */
  public getUpdateEndpoint(formatId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, formatId))
    );
  }

  /**
   * Get the endpoint to create a new bitstream format
   */
  public getCreateEndpoint(): Observable<string> {
    return this.getBrowseEndpoint();
  }

  /**
   * Update an existing bitstreamFormat
   * @param bitstreamFormat
   */
  updateBitstreamFormat(bitstreamFormat: BitstreamFormat): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();

    this.getUpdateEndpoint(bitstreamFormat.id).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) =>
        new PutRequest(requestId, endpointURL, bitstreamFormat)),
      configureRequest(this.requestService)).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );

  }

  /**
   * Create a new BitstreamFormat
   * @param {BitstreamFormat} bitstreamFormat
   */
  public createBitstreamFormat(bitstreamFormat: BitstreamFormat): Observable<RestResponse> {
    const requestId = this.requestService.generateRequestId();

    this.getCreateEndpoint().pipe(
      map((endpointURL: string) => {
        return new PostRequest(requestId, endpointURL, bitstreamFormat);
      }),
      configureRequest(this.requestService)
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
  }

  /**
   * Clears the cache of the list of BitstreamFormats
   */
  public clearBitStreamFormatRequests(): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      tap((href: string) => this.requestService.removeByHrefSubstring(href))
    );
  }

  /**
   * Gets all the selected BitstreamFormats from the store
   */
  public getSelectedBitstreamFormats(): Observable<BitstreamFormat[]> {
    return this.store.pipe(select(selectedBitstreamFormatSelector));
  }

  /**
   * Adds a BistreamFormat to the selected BitstreamFormats in the store
   * @param bitstreamFormat
   */
  public selectBitstreamFormat(bitstreamFormat: BitstreamFormat) {
    this.store.dispatch(new BitstreamFormatsRegistrySelectAction(bitstreamFormat));
  }

  /**
   * Removes a BistreamFormat from the list of selected BitstreamFormats in the store
   * @param bitstreamFormat
   */
  public deselectBitstreamFormat(bitstreamFormat: BitstreamFormat) {
    this.store.dispatch(new BitstreamFormatsRegistryDeselectAction(bitstreamFormat));
  }

  /**
   * Removes all BitstreamFormats from the list of selected BitstreamFormats in the store
   */
  public deselectAllBitstreamFormats() {
    this.store.dispatch(new BitstreamFormatsRegistryDeselectAllAction());
  }

  /**
   * Delete an existing DSpace Object on the server
   * @param format The DSpace Object to be removed
   * Return an observable that emits true when the deletion was successful, false when it failed
   */
  delete(format: BitstreamFormat): Observable<boolean> {
    const requestId = this.requestService.generateRequestId();

    const hrefObs = this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, format.id)));

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new DeleteByIDRequest(requestId, href, format.id);
        this.requestService.configure(request);
      })
    ).subscribe();

    return this.requestService.getByUUID(requestId).pipe(
      find((request: RequestEntry) => request.completed),
      map((request: RequestEntry) => request.response.isSuccessful)
    );
  }

  findByBitstream(bitstream: Bitstream): Observable<RemoteData<BitstreamFormat>> {
    return this.findByHref(bitstream._links.format.href);
  }
}
